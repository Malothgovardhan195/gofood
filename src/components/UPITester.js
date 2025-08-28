import React, { useState } from 'react';

const UPITester = () => {
  const [testResults, setTestResults] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});

  React.useEffect(() => {
    // Detect device information
    const info = {
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isAndroid: /Android/i.test(navigator.userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
      platform: navigator.platform,
      vendor: navigator.vendor
    };
    setDeviceInfo(info);
  }, []);

  const testUPIRedirection = (appType) => {
    const amount = "100";
    const merchantVPA = "gofood@okaxis";
    const note = encodeURIComponent("Test Payment for GoFood");
    
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
      default:
        upiUrl = `upi://pay?pa=${merchantVPA}&pn=GoFood&am=${amount}&cu=INR&tn=${note}`;
    }

    const startTime = Date.now();
    
    // Method 1: Try window.location.href
    try {
      window.location.href = upiUrl;
      
      setTimeout(() => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        
        const result = {
          app: appType,
          url: upiUrl,
          method: 'window.location.href',
          success: timeTaken > 2000, // If it takes more than 2 seconds, likely opened app
          timeTaken,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setTestResults(prev => [...prev, result]);
      }, 3000);
      
    } catch (error) {
      const result = {
        app: appType,
        url: upiUrl,
        method: 'window.location.href',
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
    }
  };

  const testUPIWithWindow = (appType) => {
    const amount = "100";
    const merchantVPA = "gofood@okaxis";
    const note = encodeURIComponent("Test Payment for GoFood");
    
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
      default:
        upiUrl = `upi://pay?pa=${merchantVPA}&pn=GoFood&am=${amount}&cu=INR&tn=${note}`;
    }

    // Method 2: Try window.open
    const popup = window.open(upiUrl, '_self');
    
    setTimeout(() => {
      const result = {
        app: appType,
        url: upiUrl,
        method: 'window.open',
        success: popup !== null,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
    }, 1000);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const copyUrl = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copied to clipboard! You can paste it in a UPI app.');
      });
    } else {
      alert('Copy feature not supported. URL: ' + url);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">🧪 UPI Payment Tester</h5>
        </div>
        <div className="card-body">
          {/* Device Information */}
          <div className="alert alert-info">
            <h6>📱 Device Information:</h6>
            <ul className="mb-0">
              <li><strong>Device Type:</strong> {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}</li>
              <li><strong>Platform:</strong> {deviceInfo.platform}</li>
              <li><strong>Is Android:</strong> {deviceInfo.isAndroid ? 'Yes' : 'No'}</li>
              <li><strong>Is iOS:</strong> {deviceInfo.isIOS ? 'Yes' : 'No'}</li>
              <li><strong>User Agent:</strong> {deviceInfo.userAgent}</li>
            </ul>
          </div>

          {/* Test Buttons */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <h6>🔬 Test UPI Redirection (Method 1: window.location.href):</h6>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-primary w-100"
                onClick={() => testUPIRedirection('googlepay')}
              >
                Test Google Pay
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-success w-100"
                onClick={() => testUPIRedirection('phonepe')}
              >
                Test PhonePe
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-info w-100"
                onClick={() => testUPIRedirection('paytm')}
              >
                Test Paytm
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-warning w-100"
                onClick={() => testUPIRedirection('generic')}
              >
                Test Generic UPI
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12">
              <h6>🔬 Test UPI Redirection (Method 2: window.open):</h6>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-outline-primary w-100"
                onClick={() => testUPIWithWindow('googlepay')}
              >
                Window Google Pay
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-outline-success w-100"
                onClick={() => testUPIWithWindow('phonepe')}
              >
                Window PhonePe
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-outline-info w-100"
                onClick={() => testUPIWithWindow('paytm')}
              >
                Window Paytm
              </button>
            </div>
            <div className="col-6 col-md-3">
              <button 
                className="btn btn-outline-warning w-100"
                onClick={() => testUPIWithWindow('generic')}
              >
                Window Generic
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <h6>📊 Test Results:</h6>
            <button className="btn btn-sm btn-secondary" onClick={clearResults}>
              Clear Results
            </button>
          </div>

          {/* Test Results */}
          {testResults.length === 0 ? (
            <div className="alert alert-light">
              No test results yet. Click any test button above.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>App</th>
                    <th>Method</th>
                    <th>Success</th>
                    <th>URL</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={index}>
                      <td>{result.timestamp}</td>
                      <td>
                        <span className={`badge bg-${result.success ? 'success' : 'danger'}`}>
                          {result.app}
                        </span>
                      </td>
                      <td>{result.method}</td>
                      <td>
                        {result.success ? (
                          <span className="text-success">✅ Yes</span>
                        ) : (
                          <span className="text-danger">❌ No</span>
                        )}
                        {result.timeTaken && (
                          <small className="d-block text-muted">
                            {result.timeTaken}ms
                          </small>
                        )}
                      </td>
                      <td>
                        <small className="text-muted" style={{fontSize: '10px'}}>
                          {result.url.substring(0, 50)}...
                        </small>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => copyUrl(result.url)}
                        >
                          Copy URL
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Instructions */}
          <div className="alert alert-warning mt-4">
            <h6>📋 Instructions:</h6>
            <ol>
              <li><strong>Desktop Testing:</strong> UPI redirection won't work on desktop as UPI apps aren't available</li>
              <li><strong>Mobile Testing:</strong> Open this page on your mobile phone and test</li>
              <li><strong>App Installation:</strong> Make sure you have UPI apps (Google Pay, PhonePe, Paytm) installed</li>
              <li><strong>Browser Permissions:</strong> Some browsers may block automatic redirections</li>
              <li><strong>Manual Testing:</strong> Copy the URL and paste it in a UPI app manually</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPITester;
