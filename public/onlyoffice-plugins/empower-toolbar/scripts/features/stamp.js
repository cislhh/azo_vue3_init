(function (window) {
  var FEATURE_ID = "empower_insert_stamp";
  var STAMP_WIDTH_EMU = 160 * 9525;
  var STAMP_HEIGHT_EMU = 160 * 9525;
  var featureContext = null;

  function debugLog() {
    if (!window.console || typeof window.console.log !== "function") return;

    var args = Array.prototype.slice.call(arguments);
    args.unshift("[empower-toolbar][stamp]");
    window.console.log.apply(window.console, args);
  }

  function debugError() {
    if (!window.console || typeof window.console.error !== "function") return;

    var args = Array.prototype.slice.call(arguments);
    args.unshift("[empower-toolbar][stamp]");
    window.console.error.apply(window.console, args);
  }

  function showMessage(message) {
    if (featureContext && typeof featureContext.showMessage === "function") {
      featureContext.showMessage(message);
      return;
    }

    window.alert(message);
  }

  function isWordFileType(fileType) {
    return fileType === "doc" || fileType === "docx";
  }

  function resolveUrl(url) {
    return new URL(url, window.location.href).toString();
  }

  function readBlobAsDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();

      reader.onload = function () {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("印章图片读取结果无效"));
      };
      reader.onerror = function () {
        reject(new Error("读取印章图片失败"));
      };
      reader.readAsDataURL(blob);
    });
  }

  async function fetchStampDataUrl(imageUrl) {
    var response = await fetch(resolveUrl(imageUrl), {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("获取印章图片失败：" + response.status);
    }

    return readBlobAsDataUrl(await response.blob());
  }

  function insertStampIntoWord(dataUrl) {
    Asc.scope.stampImageDataUrl = dataUrl;
    Asc.scope.stampWidthEmu = STAMP_WIDTH_EMU;
    Asc.scope.stampHeightEmu = STAMP_HEIGHT_EMU;

    window.Asc.plugin.callCommand(
      function () {
        var image = Api.CreateImage(
          Asc.scope.stampImageDataUrl,
          Asc.scope.stampWidthEmu,
          Asc.scope.stampHeightEmu
        );

        if (!image) {
          throw new Error("创建印章图片失败");
        }

        if (typeof image.SetWrappingStyle === "function") {
          image.SetWrappingStyle("inFront");
        }

        var doc = Api.GetDocument();
        if (!doc) {
          throw new Error("当前 Word 编辑器不支持插入印章");
        }

        var paragraph =
          typeof doc.GetCurrentParagraph === "function"
            ? doc.GetCurrentParagraph()
            : null;

        if (!paragraph && typeof doc.GetElement === "function") {
          paragraph = doc.GetElement(0);
        }

        if (!paragraph) {
          throw new Error("未找到当前光标段落，无法插入印章");
        }

        if (typeof paragraph.AddDrawing !== "function") {
          throw new Error("当前光标位置不支持插入浮动印章");
        }

        paragraph.AddDrawing(image);
      },
      false,
      true,
      function () {
        debugLog("stamp inserted");
      }
    );
  }

  async function insertStamp(context) {
    var runtimeContext = context && context.runtimeContext;
    var fileType =
      runtimeContext && typeof runtimeContext.fileType === "string"
        ? runtimeContext.fileType
        : "";
    var stampImageUrl =
      runtimeContext && typeof runtimeContext.stampImageUrl === "string"
        ? runtimeContext.stampImageUrl
        : "";

    if (!isWordFileType(fileType)) {
      showMessage("当前文档格式不支持插入印章");
      return;
    }

    if (!stampImageUrl) {
      showMessage("未获取到印章资源");
      return;
    }

    try {
      var dataUrl = await fetchStampDataUrl(stampImageUrl);
      insertStampIntoWord(dataUrl);
    } catch (error) {
      debugError("insert failed", error);
      showMessage("插入印章失败，请重试");
    }
  }

  var feature = {
    id: FEATURE_ID,
    availability: {
      modes: ["edit"],
      fileTypes: ["doc", "docx"],
      messageByMode: "当前工作模式不支持插入印章",
      messageByFileType: "当前文档格式不支持插入印章",
      pendingMessage: "正在获取文档状态，请稍后再试",
    },
    getToolbarItem: function (context) {
      return {
        id: FEATURE_ID,
        type: "button",
        text: "插入印章",
        hint: "获取印章图片并插入到当前光标位置",
        icons: context.toolbarIconPath,
        lockInViewMode: true,
        split: false,
        enableToggle: false,
      };
    },
    onInit: function (context) {
      featureContext = context;
    },
    onClick: function (context) {
      featureContext = context;
      insertStamp(context);
    },
  };

  window.EmpowerToolbarFeatures = window.EmpowerToolbarFeatures || [];
  window.EmpowerToolbarFeatures.push(feature);
})(window);
