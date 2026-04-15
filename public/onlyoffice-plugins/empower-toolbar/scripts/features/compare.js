(function (window) {
  var FEATURE_ID = "empower_compare_document";
  var PLUGIN_MESSAGE_SOURCE = "empower-toolbar-plugin";
  var PLUGIN_MESSAGE_TYPE_COMPARE_FILE = "empower-toolbar:compare-file-selected";
  var featureContext = null;

  function showMessage(message) {
    if (featureContext && typeof featureContext.showMessage === "function") {
      featureContext.showMessage(message);
      return;
    }
    window.alert(message);
  }

  function sendCompareFileToHost() {
    var payload = {
      source: PLUGIN_MESSAGE_SOURCE,
      type: PLUGIN_MESSAGE_TYPE_COMPARE_FILE,
      timestamp: Date.now(),
      version: featureContext ? featureContext.pluginVersion : "",
    };

    try {
      if (window.top && typeof window.top.postMessage === "function") {
        window.top.postMessage(payload, "*");
        return true;
      }
    } catch (error) {}

    try {
      if (window.parent && typeof window.parent.postMessage === "function") {
        window.parent.postMessage(payload, "*");
        return true;
      }
    } catch (error) {}

    return false;
  }

  var feature = {
    id: FEATURE_ID,
    availability: {
      modes: ["edit"],
      fileTypes: ["docx"],
      messageByMode: "当前工作模式不支持文档对比",
      messageByFileType: "文档对比仅支持 .docx 格式",
    },
    getToolbarItem: function (context) {
      return {
        id: FEATURE_ID,
        type: "button",
        text: "文档对比",
        hint: "选择修订文档并触发对比",
        icons: context.toolbarIconPath,
        lockInViewMode: true,
        split: false,
        enableToggle: false,
      };
    },
    onInit: function (context) {
      featureContext = context;
    },
    onClick: function () {
      if (!sendCompareFileToHost()) {
        showMessage("无法触发文档对比，请稍后重试");
      }
    },
  };

  window.EmpowerToolbarFeatures = window.EmpowerToolbarFeatures || [];
  window.EmpowerToolbarFeatures.push(feature);
})(window);
