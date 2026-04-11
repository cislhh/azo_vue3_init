(function (window) {
  var FEATURE_ID = "empower_insert_stamp";
  var A4_PAGE_HEIGHT_EMU = 297 * 36000;
  var A4_PAGE_WIDTH_EMU = 210 * 36000;
  var FIXED_STAMP_WIDTH_EMU = 160 * 9525;
  var FIXED_STAMP_HEIGHT_EMU = 160 * 9525;
  var FIXED_STAMP_MARGIN_EMU = 8 * 36000;
  var MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  var DEBUG_STAMP_IMAGE_DATA_URL =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'>" +
        "<circle cx='90' cy='90' r='82' fill='none' stroke='%23d11f2a' stroke-width='8'/>" +
        "<text x='90' y='78' text-anchor='middle' font-size='24' fill='%23d11f2a' font-family='Arial'>TEST</text>" +
        "<text x='90' y='112' text-anchor='middle' font-size='24' fill='%23d11f2a' font-family='Arial'>STAMP</text>" +
      "</svg>"
    );
  var fileInput = null;
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

  function isLandscapeRotation(rotation) {
    if (rotation == null) return false;

    var normalizedRotation = Math.abs(rotation) % 360;
    return normalizedRotation === 90 || normalizedRotation === 270;
  }

  function resolvePdfPageSize(page) {
    var widthEmu = A4_PAGE_WIDTH_EMU;
    var heightEmu = A4_PAGE_HEIGHT_EMU;
    var rotation = null;

    try {
      if (page && typeof page.GetWidth === "function") {
        var maybeWidth = page.GetWidth();
        if (typeof maybeWidth === "number" && maybeWidth > 0) {
          widthEmu = maybeWidth;
        }
      }
    } catch (error) {}

    try {
      if (page && typeof page.GetHeight === "function") {
        var maybeHeight = page.GetHeight();
        if (typeof maybeHeight === "number" && maybeHeight > 0) {
          heightEmu = maybeHeight;
        }
      }
    } catch (error) {}

    try {
      if (page && typeof page.GetRotation === "function") {
        rotation = page.GetRotation();
      }
    } catch (error) {}

    if (isLandscapeRotation(rotation)) {
      return {
        heightEmu: widthEmu,
        widthEmu: heightEmu,
      };
    }

    return {
      heightEmu: heightEmu,
      widthEmu: widthEmu,
    };
  }

  function calculatePdfStampPosition(page, stampWidthEmu, stampHeightEmu, marginEmu) {
    var pageSize = resolvePdfPageSize(page);

    return {
      x: Math.max(0, pageSize.widthEmu - stampWidthEmu - marginEmu),
      y: Math.max(0, pageSize.heightEmu - stampHeightEmu - marginEmu),
    };
  }

  function showMessage(message) {
    if (featureContext && typeof featureContext.showMessage === "function") {
      featureContext.showMessage(message);
      return;
    }
    window.alert(message);
  }

  function createFileInput() {
    if (fileInput) return fileInput;

    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpeg,image/jpg,image/gif,image/webp";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", onFileChanged);
    document.body.appendChild(fileInput);
    return fileInput;
  }

  function openImagePicker() {
    var input = createFileInput();
    input.value = "";
    input.click();
  }

  async function insertDebugStampImage() {
    var size = await measureImage(DEBUG_STAMP_IMAGE_DATA_URL);
    debugLog("debug stamp image measured", size);
    insertStampImage(DEBUG_STAMP_IMAGE_DATA_URL, size.widthEmu, size.heightEmu);
  }

  function readAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(new Error("读取图片失败"));
      };
      reader.readAsDataURL(file);
    });
  }

  function measureImage(dataUrl) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () {
        var maxWidthPx = 180;
        var ratio = image.width > maxWidthPx ? maxWidthPx / image.width : 1;
        var widthPx = Math.max(24, Math.round(image.width * ratio));
        var heightPx = Math.max(24, Math.round(image.height * ratio));

        resolve({
          widthEmu: widthPx * 9525,
          heightEmu: heightPx * 9525,
        });
      };
      image.onerror = function () {
        reject(new Error("解析图片尺寸失败"));
      };
      image.src = dataUrl;
    });
  }

  function insertStampImage(dataUrl, widthEmu, heightEmu) {
    debugLog("insert requested", {
      fileType:
        featureContext &&
        featureContext.runtimeContext &&
        featureContext.runtimeContext.fileType,
      fixedStampHeightEmu: FIXED_STAMP_HEIGHT_EMU,
      fixedStampMarginEmu: FIXED_STAMP_MARGIN_EMU,
      fixedStampWidthEmu: FIXED_STAMP_WIDTH_EMU,
      sourceHeightEmu: heightEmu,
      sourceWidthEmu: widthEmu,
    });

    Asc.scope.imageSrc = dataUrl;
    Asc.scope.widthEmu = widthEmu;
    Asc.scope.heightEmu = heightEmu;
    Asc.scope.fixedStampWidthEmu = FIXED_STAMP_WIDTH_EMU;
    Asc.scope.fixedStampHeightEmu = FIXED_STAMP_HEIGHT_EMU;
    Asc.scope.fixedStampMarginEmu = FIXED_STAMP_MARGIN_EMU;

    window.Asc.plugin.callCommand(
      function () {
        var imageSrc = Asc.scope.imageSrc;
        var width = Asc.scope.widthEmu;
        var height = Asc.scope.heightEmu;
        var fixedStampWidth = Asc.scope.fixedStampWidthEmu;
        var fixedStampHeight = Asc.scope.fixedStampHeightEmu;
        var fixedStampMargin = Asc.scope.fixedStampMarginEmu;
        var a4PageWidthEmu = 210 * 36000;
        var a4PageHeightEmu = 297 * 36000;
        var commandLog = function () {
          if (typeof console === "undefined" || typeof console.log !== "function") return;

          var args = Array.prototype.slice.call(arguments);
          args.unshift("[empower-toolbar][stamp][command]");
          console.log.apply(console, args);
        };
        var commandError = function () {
          if (typeof console === "undefined" || typeof console.error !== "function") return;

          var args = Array.prototype.slice.call(arguments);
          args.unshift("[empower-toolbar][stamp][command]");
          console.error.apply(console, args);
        };
        var commandIsLandscapeRotation = function (rotation) {
          if (rotation == null) return false;

          var normalizedRotation = Math.abs(rotation) % 360;
          return normalizedRotation === 90 || normalizedRotation === 270;
        };
        var commandResolvePdfPageSize = function (page) {
          var widthEmu = a4PageWidthEmu;
          var heightEmu = a4PageHeightEmu;
          var rotation = null;

          try {
            if (page && typeof page.GetWidth === "function") {
              var maybeWidth = page.GetWidth();
              if (typeof maybeWidth === "number" && maybeWidth > 0) {
                widthEmu = maybeWidth;
              }
            }
          } catch (error) {}

          try {
            if (page && typeof page.GetHeight === "function") {
              var maybeHeight = page.GetHeight();
              if (typeof maybeHeight === "number" && maybeHeight > 0) {
                heightEmu = maybeHeight;
              }
            }
          } catch (error) {}

          try {
            if (page && typeof page.GetRotation === "function") {
              rotation = page.GetRotation();
            }
          } catch (error) {}

          if (commandIsLandscapeRotation(rotation)) {
            return {
              heightEmu: widthEmu,
              rotation: rotation,
              widthEmu: heightEmu,
            };
          }

          return {
            heightEmu: heightEmu,
            rotation: rotation,
            widthEmu: widthEmu,
          };
        };
        var commandCalculatePdfStampPosition = function (page) {
          var pageSize = commandResolvePdfPageSize(page);

          return {
            pageHeight: pageSize.heightEmu,
            pageRotation: pageSize.rotation,
            pageWidth: pageSize.widthEmu,
            x: Math.max(0, pageSize.widthEmu - fixedStampWidth - fixedStampMargin),
            y: Math.max(0, pageSize.heightEmu - fixedStampHeight - fixedStampMargin),
          };
        };

        try {
          if (typeof Api.GetActiveSheet === "function") {
            var sheet = Api.GetActiveSheet();
            if (sheet && typeof sheet.AddImage === "function") {
              sheet.AddImage(imageSrc, width, height, 0, 2 * 36000, 0, 2 * 36000);
              return;
            }
          }
        } catch (error) {}

        try {
          if (typeof Api.GetPresentation === "function") {
            var presentation = Api.GetPresentation();
            var slide =
              presentation && typeof presentation.GetCurrentSlide === "function"
                ? presentation.GetCurrentSlide()
                : presentation && typeof presentation.GetSlideByIndex === "function"
                  ? presentation.GetSlideByIndex(0)
                  : null;

            var imageObject = Api.CreateImage(imageSrc, width, height);
            if (imageObject && typeof imageObject.SetPosition === "function") {
              imageObject.SetPosition(2 * 36000, 2 * 36000);
            }
            if (slide && typeof slide.AddObject === "function") {
              slide.AddObject(imageObject);
              return;
            }
          }
        } catch (error) {}

        try {
          if (typeof Api.GetDocument === "function") {
            var doc = Api.GetDocument();
            var image = Api.CreateImage(imageSrc, fixedStampWidth, fixedStampHeight);
            commandLog("document branch entered", {
              hasAddDrawingToPage: !!(doc && typeof doc.AddDrawingToPage === "function"),
              hasGetCurrentPage: !!(doc && typeof doc.GetCurrentPage === "function"),
              hasGetPage: !!(doc && typeof doc.GetPage === "function"),
            });

            if (doc && typeof doc.GetPage === "function") {
              var pageIndex = 0;
              var pdfPage = null;

              try {
                if (typeof Api.GetCurrentPage === "function") {
                  var currentPage = Api.GetCurrentPage();
                  if (typeof currentPage === "number" && currentPage >= 0) {
                    pageIndex = currentPage;
                  }
                }
              } catch (error) {}

              try {
                pdfPage = doc.GetPage(pageIndex);
              } catch (error) {
                commandError("GetPage failed", error);
                pdfPage = null;
              }

              if (pdfPage && typeof pdfPage.AddObject === "function") {
                var pdfPosition = commandCalculatePdfStampPosition(pdfPage);

                commandLog("pdf branch resolved", {
                  pageHeight: pdfPosition.pageHeight,
                  pageIndex: pageIndex,
                  pageRotation: pdfPosition.pageRotation,
                  pageWidth: pdfPosition.pageWidth,
                  positionX: pdfPosition.x,
                  positionY: pdfPosition.y,
                });

                if (image && typeof image.SetPosition === "function") {
                  image.SetPosition(pdfPosition.x, pdfPosition.y);
                }

                pdfPage.AddObject(image);
                commandLog("pdf branch inserted");
                return;
              }

              commandLog("pdf branch unavailable", {
                hasAddObject: !!(pdfPage && typeof pdfPage.AddObject === "function"),
                pageIndex: pageIndex,
              });
            }

            if (image && typeof image.SetWrappingStyle === "function") {
              image.SetWrappingStyle("inFront");
            }
            if (image && typeof image.SetHorAlign === "function") {
              image.SetHorAlign("page", "right");
            }
            if (image && typeof image.SetVerAlign === "function") {
              image.SetVerAlign("page", "bottom");
            }
            if (image && typeof image.SetDistances === "function") {
              image.SetDistances(
                fixedStampMargin,
                fixedStampMargin,
                fixedStampMargin,
                fixedStampMargin
              );
            }

            if (
              doc &&
              typeof doc.AddDrawingToPage === "function" &&
              typeof doc.GetCurrentPage === "function"
            ) {
              var twipToEmu = 635;
              var currentPage = doc.GetCurrentPage();
              var x = fixedStampMargin;
              var y = fixedStampMargin;

              if (typeof doc.GetFinalSection === "function") {
                var section = doc.GetFinalSection();
                if (
                  section &&
                  typeof section.GetPageWidth === "function" &&
                  typeof section.GetPageHeight === "function" &&
                  typeof section.GetPageMarginRight === "function" &&
                  typeof section.GetPageMarginBottom === "function"
                ) {
                  var pageWidthEmu = section.GetPageWidth() * twipToEmu;
                  var pageHeightEmu = section.GetPageHeight() * twipToEmu;
                  var rightMarginEmu = section.GetPageMarginRight() * twipToEmu;
                  var bottomMarginEmu = section.GetPageMarginBottom() * twipToEmu;
                  x = Math.max(
                    0,
                    pageWidthEmu - rightMarginEmu - fixedStampWidth - fixedStampMargin
                  );
                  y = Math.max(
                    0,
                    pageHeightEmu - bottomMarginEmu - fixedStampHeight - fixedStampMargin
                  );
                }
              }

              doc.AddDrawingToPage(image, currentPage, x, y);
              commandLog("word fallback inserted", {
                currentPage: currentPage,
                positionX: x,
                positionY: y,
              });
              return;
            }

            var paragraph =
              doc && typeof doc.GetCurrentParagraph === "function"
                ? doc.GetCurrentParagraph()
                : null;

            if (!paragraph && doc && typeof doc.GetElement === "function") {
              paragraph = doc.GetElement(0);
            }

            if (
              !paragraph &&
              doc &&
              typeof doc.Push === "function" &&
              typeof Api.CreateParagraph === "function"
            ) {
              paragraph = Api.CreateParagraph();
              doc.Push(paragraph);
            }

            if (paragraph && typeof paragraph.AddDrawing === "function") {
              paragraph.AddDrawing(image);
              commandLog("paragraph fallback inserted");
              return;
            }
          }
        } catch (error) {
          commandError("insert command failed", error);
        }
      },
      false,
      true,
      function () {
        debugLog("callCommand callback completed");
      }
    );
  }

  function validateImage(file) {
    var validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      return "请选择 PNG、JPG、GIF 或 WebP 格式的图片";
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return "图片大小不能超过 5MB";
    }

    return "";
  }

  async function onFileChanged(event) {
    var file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;

    var validationError = validateImage(file);
    if (validationError) {
      showMessage(validationError);
      return;
    }

    try {
      var dataUrl = await readAsDataUrl(file);
      var size = await measureImage(dataUrl);
      debugLog("image measured", size);
      insertStampImage(dataUrl, size.widthEmu, size.heightEmu);
    } catch (error) {
      debugError("insert failed", error);
      showMessage("插入印章失败，请重试");
    }
  }

  var feature = {
    id: FEATURE_ID,
    availability: {
      modes: ["edit"],
      fileTypes: ["docx", "pdf", "xlsx", "pptx"],
      messageByMode: "当前工作模式不支持插入印章",
      messageByFileType: "当前文档格式不支持插入印章",
    },
    getToolbarItem: function (context) {
      return {
        id: FEATURE_ID,
        type: "button",
        text: "插入印章",
        hint: "上传印章图片并插入到文档",
        icons: context.toolbarIconPath,
        lockInViewMode: true,
        split: false,
        enableToggle: false,
      };
    },
    onInit: function (context) {
      featureContext = context;
      createFileInput();
    },
    onClick: function (context) {
      if (context && context.altKey) {
        insertDebugStampImage().catch(function (error) {
          debugError("debug stamp insert failed", error);
          showMessage("调试印章插入失败，请重试");
        });
        return;
      }

      openImagePicker();
    },
  };

  window.EmpowerToolbarFeatures = window.EmpowerToolbarFeatures || [];
  window.EmpowerToolbarFeatures.push(feature);
})(window);
