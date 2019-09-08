const chromeAPIAdapter = {
  sendMessage : function(options) {
    return new Promise((resolve, reject) => {
      try{
        chrome.runtime.sendMessage(options, resolve)
      }catch(e) {
        reject();
      }
    });
  }
};

export default chromeAPIAdapter;
