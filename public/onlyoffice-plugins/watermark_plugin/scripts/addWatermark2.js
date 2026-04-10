(function (window, undefined) {
  function resolveWatermarkImageUrl() {
    return new URL("resources/watermark.png", window.location.href).toString();
  }

  window.Asc.plugin.init = function () {
    Asc.scope.watermarkImageUrl = resolveWatermarkImageUrl();

    this.callCommand(function () {
      var doc = Api.GetDocument();
      var watermarkSettings = doc.GetWatermarkSettings();
      watermarkSettings.SetType("image");
      watermarkSettings.SetImageURL(Asc.scope.watermarkImageUrl);
      watermarkSettings.SetImageSize(36000 * 70, 36000 * 80);
      watermarkSettings.SetDirection("clockwise45");
      watermarkSettings.SetOpacity(200);
      doc.SetWatermarkSettings(watermarkSettings);
    }, true);
  };

  window.Asc.plugin.button = function (id) {};
})(window, undefined);
