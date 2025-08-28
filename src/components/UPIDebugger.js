import React, { useState } from 'react';

const UPIDebugger = () => {
  const [testResults, setTestResults] = useState([]);
  const [upiId, setUpiId] = useState('test@okaxis');
  const amount = 100;

  const addResult = (test, result, details) => {
    setTestResults(prev => [...prev, {
      test,
      result,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testUPIRedirection = (appType) => {
    const merchantVPA = "gofood@okaxis";
    const note = encodeURIComponent(`Test Payment`);
    
    let upiUrl = '';
    switch(appType) {
      case 'googlepay':
        upiUrl = `tez://upi/pay?pa=${merchantVPA}&pn=GoFood&am=${amount}&cu=INR&tn=${note}`;
        break;
      case 'phonepe':
        upiUrl = `phonepe://pay?pa=${merchantVPA}&pn=GoFood&am=${amount}&cu=INR&tn=${note}`;
        break;
      case 'paytm':
        upiUrl = `paytmmp://pay?pa=${merchantVPA}&pn=GoFood&am=${amount}&cu=INR&tn=${note}`;
        break;
      case 'generic':
        upiUrl = `upi://pay?pa=${merchantVPA}&pn=GoFood&am=${amount}&cu=INR&tn=${note}`;
        break;
    }

    addResult(`${appType} URL Test`, 'ATTEMPTING', `URL: ${upiUrl}`);
    
    try {
      // Test 1: Direct window.location.href
      window.location.href = upiUrl;
      addResult(`${appType} Direct Redirect`, 'SUCCESS', 'window.location.href executed');
      
      // Test 2: Create and click link
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = upiUrl;
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addResult(`${appType} Link Click`, 'SUCCESS', 'Link created and clicked');
      }, 1000);
      
      // Test 3: Window.open
      setTimeout(() => {
        const newWindow = window.open(upiUrl, '_blank');
        if (newWindow) {
          addResult(`${appType} Window Open`, 'SUCCESS', 'New window opened');
        } else {
          addResult(`${appType} Window Open`, 'FAILED', 'Popup blocked or failed');
        }
      }, 2000);
      
    } catch (error) {
      addResult(`${appType} Test`, 'ERROR', error.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5>🔧 UPI Payment Debugger</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Test UPI ID:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID for testing"
                />
              </div>
              
              <div className="mb-3">
                <p><strong>Device Info:</strong></p>
                <ul>
                  <li>User Agent: {navigator.userAgent}</li>
                  <li>Platform: {navigator.platform}</li>
                  <li>Mobile: {/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Yes' : 'No'}</li>
                </ul>
              </div>

              <h6>Test UPI App Redirection:</h6>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => testUPIRedirection('googlepay')}
                  >
                    Test Google Pay
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    className="btn btn-success w-100"
                    onClick={() => testUPIRedirection('phonepe')}
                  >
                    Test PhonePe
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    className="btn btn-info w-100"
                    onClick={() => testUPIRedirection('paytm')}
                  >
                    Test Paytm
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    className="btn btn-warning w-100"
                    onClick={() => testUPIRedirection('generic')}
                  >
                    Test Generic UPI
                  </button>
                </div>
              </div>

              <button 
                className="btn btn-secondary"
                onClick={clearResults}
              >
                Clear Results
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-secondary text-white">
              <h6>📊 Test Results</h6>
            </div>
            <div className="card-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {testResults.length === 0 ? (
                <p className="text-muted">No tests run yet</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-2">
                    <div className={`alert alert-${
                      result.result === 'SUCCESS' ? 'success' : 
                      result.result === 'FAILED' ? 'warning' : 
                      result.result === 'ERROR' ? 'danger' : 'info'
                    } py-2`}>
                      <strong>{result.test}</strong><br/>
                      <small>
                        {result.result} - {result.timestamp}<br/>
                        {result.details}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h6>🧪 Testing Instructions:</h6>
            <ol>
              <li><strong>On Mobile:</strong> UPI URLs should open the respective apps directly</li>
              <li><strong>On Desktop:</strong> Browser may show "Open app" dialog or do nothing</li>
              <li><strong>Success Indicators:</strong> App opens, or browser asks to open an app</li>
              <li><strong>Failure Indicators:</strong> Nothing happens, error messages, or page redirects unexpectedly</li>
            </ol>
            
            <h6 className="mt-3">📱 Expected Behavior:</h6>
            <ul>
              <li><strong>Android:</strong> UPI apps should open if installed</li>
              <li><strong>iOS:</strong> May need specific app schemes or fallback to web</li>
              <li><strong>Desktop:</strong> Usually shows "Open app" dialog or copies URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIDebugger;
