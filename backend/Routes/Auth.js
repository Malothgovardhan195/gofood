const express = require('express')
const User = require('../models/User')
const Order = require('../models/Orders')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const axios = require('axios')
const fetch = require('../middleware/fetchdetails');
const jwtSecret = "HaHa"
// var foodItems= require('../index').foodData;
// require("../index")
//Creating a user and storing data to MongoDB Atlas, No Login Requiered
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            // password: req.body.password,  first write this and then use bcryptjs
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true
            res.json({ success, authToken })
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Please enter a unique value." })
            })
    } catch (error) {
        console.error(error.message)
    }
})

// Authentication a User, No login Requiered
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password") // -password will not pick password from db.
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
// Get logged in User details, Login Required.
router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat
        let long = req.body.latlong.long
        console.log(lat, long)
        let location = await axios
            .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
            .then(async res => {
                // console.log(`statusCode: ${res.status}`)
                console.log(res.data.results)
                // let response = stringify(res)
                // response = await JSON.parse(response)
                let response = res.data.results[0].components;
                console.log(response)
                let { village, county, state_district, state, postcode } = response
                return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
            })
            .catch(error => {
                console.error(error)
            })
        res.send({ location })

    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
router.post('/foodData', async (req, res) => {
    try {
        // console.log( JSON.stringify(global.foodData))
        // const userId = req.user.id;
        // await database.listCollections({name:"food_items"}).find({});
        res.send([global.foodData, global.foodCategory])
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})

router.post('/orderData', async (req, res) => {
    try {
        let data = req.body.order_data
        await data.splice(0,0,{Order_date:req.body.order_date})
        console.log("📦 Order request received for email:", req.body.email)
        console.log("📋 Order data:", data)

        //if email not existing in db then create: else: InsertMany()
        let eId = await Order.findOne({ 'email': req.body.email })    
        console.log("🔍 Existing order found:", eId ? "Yes" : "No")
        
        if (eId===null) {
            try {
                console.log("🆕 Creating new order record")
                await Order.create({
                    email: req.body.email,
                    order_data:[data]
                }).then(() => {
                    console.log("✅ New order created successfully")
                    res.json({ success: true })
                })
            } catch (error) {
                console.log("❌ Error creating new order:", error.message)
                res.status(500).json({ success: false, error: error.message })
            }
        }
        else {
            try {
                console.log("🔄 Updating existing order record")
                await Order.findOneAndUpdate({email:req.body.email},
                    { $push:{order_data: data} }).then(() => {
                        console.log("✅ Order updated successfully")
                        res.json({ success: true })
                    })
            } catch (error) {
                console.log("❌ Error updating order:", error.message)
                res.status(500).json({ success: false, error: error.message })
            }
        }
    } catch (error) {
        console.log("❌ Order processing error:", error.message)
        res.status(500).json({ success: false, error: "Server Error" })
    }
})

router.post('/myOrderData', async (req, res) => {
    try {
        const email = req.body.email;
        console.log("🔍 Fetching orders for email:", email)
        
        if (!email) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        let eId = await Order.findOne({ 'email': email })
        console.log("📋 Order data found:", eId ? "Yes" : "No")
        
        if (eId) {
            console.log("📦 Number of orders:", eId.order_data ? eId.order_data.length : 0)
        }
        
        res.json({orderData: eId})
    } catch (error) {
        console.error("❌ Error fetching orders:", error.message)
        res.status(500).json({ success: false, error: error.message })
    }
});

module.exports = router