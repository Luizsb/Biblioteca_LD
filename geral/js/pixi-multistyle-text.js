(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MultiStyleText = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require("./pixi-multistyle-text").default;
},{"./pixi-multistyle-text":2}],2:[function(require,module,exports){
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MultiStyleText = (function (_super) {
        __extends(MultiStyleText, _super);
        function MultiStyleText(text, styles) {
            var _this = _super.call(this, text) || this;
            _this.styles = styles;
            return _this;
        }
        Object.defineProperty(MultiStyleText.prototype, "styles", {
            set: function (styles) {
                this.textStyles = {};
                this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
                for (var style in styles) {
                    if (style === "default") {
                        this.assign(this.textStyles["default"], styles[style]);
                    }
                    else {
                        this.textStyles[style] = this.assign({}, styles[style]);
                    }
                }
                this._style = new PIXI.TextStyle(this.textStyles["default"]);
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        MultiStyleText.prototype.setTagStyle = function (tag, style) {
            if (tag in this.textStyles) {
                this.assign(this.textStyles[tag], style);
            }
            else {
                this.textStyles[tag] = this.assign({}, style);
            }
            this._style = new PIXI.TextStyle(this.textStyles["default"]);
            this.dirty = true;
        };
        MultiStyleText.prototype.deleteTagStyle = function (tag) {
            if (tag === "default") {
                this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
            }
            else {
                delete this.textStyles[tag];
            }
            this._style = new PIXI.TextStyle(this.textStyles["default"]);
            this.dirty = true;
        };
        MultiStyleText.prototype._getTextDataPerLine = function (lines) {
            var outputTextData = [];
            var tags = Object.keys(this.textStyles).join("|");
            var re = new RegExp("</?(" + tags + ")>", "g");
            var styleStack = [this.assign({}, this.textStyles["default"])];
            var tagNameStack = ["default"];
            for (var i = 0; i < lines.length; i++) {
                var lineTextData = [];
                var matches = [];
                var matchArray = void 0;
                while (matchArray = re.exec(lines[i])) {
                    matches.push(matchArray);
                }
                if (matches.length === 0) {
                    lineTextData.push(this.createTextData(lines[i], styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                }
                else {
                    var currentSearchIdx = 0;
                    for (var j = 0; j < matches.length; j++) {
                        if (matches[j].index > currentSearchIdx) {
                            lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx, matches[j].index), styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                        }
                        if (matches[j][0][1] === "/") {
                            if (styleStack.length > 1) {
                                styleStack.pop();
                                tagNameStack.pop();
                            }
                        }
                        else {
                            styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[matches[j][1]]));
                            tagNameStack.push(matches[j][1]);
                        }
                        currentSearchIdx = matches[j].index + matches[j][0].length;
                    }
                    if (currentSearchIdx < lines[i].length) {
                        lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx), styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                    }
                }
                outputTextData.push(lineTextData);
            }
            return outputTextData;
        };
        MultiStyleText.prototype.getFontString = function (style) {
            return new PIXI.TextStyle(style).toFontString();
        };
        MultiStyleText.prototype.createTextData = function (text, style, tagName) {
            return {
                text: text,
                style: style,
                width: 0,
                height: 0,
                fontProperties: undefined,
                tagName: tagName
            };
        };
        MultiStyleText.prototype.getDropShadowPadding = function () {
            var _this = this;
            var maxDistance = 0;
            var maxBlur = 0;
            Object.keys(this.textStyles).forEach(function (styleKey) {
                var _a = _this.textStyles[styleKey], dropShadowDistance = _a.dropShadowDistance, dropShadowBlur = _a.dropShadowBlur;
                maxDistance = Math.max(maxDistance, dropShadowDistance || 0);
                maxBlur = Math.max(maxBlur, dropShadowBlur || 0);
            });
            return maxDistance + maxBlur;
        };
        MultiStyleText.prototype.updateText = function () {
            var _this = this;
            if (!this.dirty) {
                return;
            }
            this.texture.baseTexture.resolution = this.resolution;
            var textStyles = this.textStyles;
            var outputText = this.text;
            if (this._style.wordWrap) {
                outputText = this.wordWrap(this.text);
            }
            var lines = outputText.split(/(?:\r\n|\r|\n)/);
            var outputTextData = this._getTextDataPerLine(lines);
            var lineWidths = [];
            var lineYMins = [];
            var lineYMaxs = [];
            var baselines = [];
            var maxLineWidth = 0;
            for (var i = 0; i < lines.length; i++) {
                var lineWidth = 0;
                var lineYMin = 0;
                var lineYMax = 0;
                var baseline = 0;
                for (var j = 0; j < outputTextData[i].length; j++) {
                    var sty = outputTextData[i][j].style;
                    this.context.font = this.getFontString(sty);
                    outputTextData[i][j].width = this.context.measureText(outputTextData[i][j].text).width;
                    if (outputTextData[i][j].text.length === 0) {
                        outputTextData[i][j].width += (outputTextData[i][j].text.length - 1) * sty.letterSpacing;
                        if (j > 0) {
                            lineWidth += sty.letterSpacing / 2;
                        }
                        if (j < outputTextData[i].length - 1) {
                            lineWidth += sty.letterSpacing / 2;
                        }
                    }
                    lineWidth += outputTextData[i][j].width;
                    outputTextData[i][j].fontProperties = PIXI.TextMetrics.measureFont(this.context.font);
                    outputTextData[i][j].height =
                        outputTextData[i][j].fontProperties.fontSize + outputTextData[i][j].style.strokeThickness;
                    if (typeof sty.valign === "number") {
                        lineYMin = Math.min(lineYMin, sty.valign - outputTextData[i][j].fontProperties.descent);
                        lineYMax = Math.max(lineYMax, sty.valign + outputTextData[i][j].fontProperties.ascent);
                    }
                    else {
                        lineYMin = Math.min(lineYMin, -outputTextData[i][j].fontProperties.descent);
                        lineYMax = Math.max(lineYMax, outputTextData[i][j].fontProperties.ascent);
                    }
                }
                lineWidths[i] = lineWidth;
                lineYMins[i] = lineYMin;
                lineYMaxs[i] = lineYMax;
                maxLineWidth = Math.max(maxLineWidth, lineWidth);
            }
            var stylesArray = Object.keys(textStyles).map(function (key) { return textStyles[key]; });
            var maxStrokeThickness = stylesArray.reduce(function (prev, cur) { return Math.max(prev, cur.strokeThickness || 0); }, 0);
            var dropShadowPadding = this.getDropShadowPadding();
            var totalHeight = lineYMaxs.reduce(function (prev, cur) { return prev + cur; }, 0) - lineYMins.reduce(function (prev, cur) { return prev + cur; }, 0);
            var width = maxLineWidth + maxStrokeThickness + 2 * dropShadowPadding;
            var height = totalHeight + 2 * dropShadowPadding;
            this.canvas.width = (width + this.context.lineWidth) * this.resolution;
            this.canvas.height = height * this.resolution;
            this.context.scale(this.resolution, this.resolution);
            this.context.textBaseline = "alphabetic";
            this.context.lineJoin = "round";
            var basePositionY = dropShadowPadding;
            var drawingData = [];
            for (var i = 0; i < outputTextData.length; i++) {
                var line = outputTextData[i];
                var linePositionX = void 0;
                switch (this._style.align) {
                    case "left":
                        linePositionX = dropShadowPadding;
                        break;
                    case "center":
                        linePositionX = dropShadowPadding + (maxLineWidth - lineWidths[i]) / 2;
                        break;
                    case "right":
                        linePositionX = dropShadowPadding + maxLineWidth - lineWidths[i];
                        break;
                }
                for (var j = 0; j < line.length; j++) {
                    var _a = line[j], style = _a.style, text = _a.text, fontProperties = _a.fontProperties, width_1 = _a.width, height_1 = _a.height, tagName = _a.tagName;
                    linePositionX += maxStrokeThickness / 2;
                    var linePositionY = maxStrokeThickness / 2 + basePositionY + fontProperties.ascent;
                    switch (style.valign) {
                        case "top":
                            break;
                        case "baseline":
                            linePositionY += lineYMaxs[i] - fontProperties.ascent;
                            break;
                        case "middle":
                            linePositionY += (lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent) / 2;
                            break;
                        case "bottom":
                            linePositionY += lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent;
                            break;
                        default:
                            linePositionY += lineYMaxs[i] - fontProperties.ascent - style.valign;
                            break;
                    }
                    if (style.letterSpacing === 0) {
                        drawingData.push({
                            text: text,
                            style: style,
                            x: linePositionX,
                            y: linePositionY,
                            width: width_1,
                            ascent: fontProperties.ascent,
                            descent: fontProperties.descent,
                            tagName: tagName
                        });
                        linePositionX += line[j].width;
                    }
                    else {
                        this.context.font = this.getFontString(line[j].style);
                        for (var k = 0; k < text.length; k++) {
                            if (k > 0 || j > 0) {
                                linePositionX += style.letterSpacing / 2;
                            }
                            drawingData.push({
                                text: text.charAt(k),
                                style: style,
                                x: linePositionX,
                                y: linePositionY,
                                width: width_1,
                                ascent: fontProperties.ascent,
                                descent: fontProperties.descent,
                                tagName: tagName
                            });
                            linePositionX += this.context.measureText(text.charAt(k)).width;
                            if (k < text.length - 1 || j < line.length - 1) {
                                linePositionX += style.letterSpacing / 2;
                            }
                        }
                    }
                    linePositionX -= maxStrokeThickness / 2;
                }
                basePositionY += lineYMaxs[i] - lineYMins[i];
            }
            this.context.save();
            drawingData.forEach(function (_a) {
                var style = _a.style, text = _a.text, x = _a.x, y = _a.y;
                if (!style.dropShadow) {
                    return;
                }
                _this.context.font = _this.getFontString(style);
                var dropFillStyle = style.dropShadowColor;
                if (typeof dropFillStyle === "number") {
                    dropFillStyle = PIXI.utils.hex2string(dropFillStyle);
                }
                _this.context.shadowColor = dropFillStyle;
                _this.context.shadowBlur = style.dropShadowBlur;
                _this.context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
                _this.context.shadowOffsetY = Math.sin(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
                _this.context.fillText(text, x, y);
            });
            this.context.restore();
            drawingData.forEach(function (_a) {
                var style = _a.style, text = _a.text, x = _a.x, y = _a.y, width = _a.width, ascent = _a.ascent, descent = _a.descent, tagName = _a.tagName;
                _this.context.font = _this.getFontString(style);
                var strokeStyle = style.stroke;
                if (typeof strokeStyle === "number") {
                    strokeStyle = PIXI.utils.hex2string(strokeStyle);
                }
                _this.context.strokeStyle = strokeStyle;
                _this.context.lineWidth = style.strokeThickness;
                var fillStyle = style.fill;
                if (typeof fillStyle === "number") {
                    fillStyle = PIXI.utils.hex2string(fillStyle);
                }
                else if (Array.isArray(fillStyle)) {
                    for (var i = 0; i < fillStyle.length; i++) {
                        var fill = fillStyle[i];
                        if (typeof fill === "number") {
                            fillStyle[i] = PIXI.utils.hex2string(fill);
                        }
                    }
                }
                _this.context.fillStyle = _this._generateFillStyle(new PIXI.TextStyle(style), [text]);
                if (style.stroke && style.strokeThickness) {
                    _this.context.strokeText(text, x, y);
                }
                if (style.fill) {
                    _this.context.fillText(text, x, y);
                }
                var debugSpan = style.debug === undefined
                    ? MultiStyleText.debugOptions.spans.enabled
                    : style.debug;
                if (debugSpan) {
                    _this.context.lineWidth = 1;
                    if (MultiStyleText.debugOptions.spans.bounding) {
                        _this.context.fillStyle = MultiStyleText.debugOptions.spans.bounding;
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bounding;
                        _this.context.beginPath();
                        _this.context.rect(x, y - ascent, width, ascent + descent);
                        _this.context.fill();
                        _this.context.stroke();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.baseline) {
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.baseline;
                        _this.context.beginPath();
                        _this.context.moveTo(x, y);
                        _this.context.lineTo(x + width, y);
                        _this.context.closePath();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.top) {
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.top;
                        _this.context.beginPath();
                        _this.context.moveTo(x, y - ascent);
                        _this.context.lineTo(x + width, y - ascent);
                        _this.context.closePath();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.bottom) {
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bottom;
                        _this.context.beginPath();
                        _this.context.moveTo(x, y + descent);
                        _this.context.lineTo(x + width, y + descent);
                        _this.context.closePath();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.text) {
                        _this.context.fillStyle = "#ffffff";
                        _this.context.strokeStyle = "#000000";
                        _this.context.lineWidth = 2;
                        _this.context.font = "8px monospace";
                        _this.context.strokeText(tagName, x, y - ascent + 8);
                        _this.context.fillText(tagName, x, y - ascent + 8);
                        _this.context.strokeText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                        _this.context.fillText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                    }
                }
            });
            if (MultiStyleText.debugOptions.objects.enabled) {
                if (MultiStyleText.debugOptions.objects.bounding) {
                    this.context.fillStyle = MultiStyleText.debugOptions.objects.bounding;
                    this.context.beginPath();
                    this.context.rect(0, 0, width, height);
                    this.context.fill();
                }
                if (MultiStyleText.debugOptions.objects.text) {
                    this.context.fillStyle = "#ffffff";
                    this.context.strokeStyle = "#000000";
                    this.context.lineWidth = 2;
                    this.context.font = "8px monospace";
                    this.context.strokeText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
                    this.context.fillText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
                }
            }
            this.updateTexture();
        };
        MultiStyleText.prototype.wordWrap = function (text) {
            var result = '';
            var tags = Object.keys(this.textStyles).join("|");
            var re = new RegExp("(</?(" + tags + ")>)", "g");
            var lines = text.split("\n");
            var wordWrapWidth = this._style.wordWrapWidth;
            var styleStack = [this.assign({}, this.textStyles["default"])];
            this.context.font = this.getFontString(this.textStyles["default"]);
            for (var i = 0; i < lines.length; i++) {
                var spaceLeft = wordWrapWidth;
                var words = lines[i].split(" ");
                for (var j = 0; j < words.length; j++) {
                    var parts = words[j].split(re);
                    for (var k = 0; k < parts.length; k++) {
                        if (re.test(parts[k])) {
                            result += parts[k];
                            if (parts[k][1] === "/") {
                                k++;
                                styleStack.pop();
                            }
                            else {
                                k++;
                                styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[parts[k]]));
                            }
                            this.context.font = this.getFontString(styleStack[styleStack.length - 1]);
                            continue;
                        }
                        var partWidth = this.context.measureText(parts[k]).width;
                        if (this._style.breakWords && partWidth > spaceLeft) {
                            var characters = parts[k].split('');
                            if (j > 0 && k === 0) {
                                result += " ";
                                spaceLeft -= this.context.measureText(" ").width;
                            }
                            for (var c = 0; c < characters.length; c++) {
                                var characterWidth = this.context.measureText(characters[c]).width;
                                if (characterWidth > spaceLeft) {
                                    result += "\n" + characters[c];
                                    spaceLeft = wordWrapWidth - characterWidth;
                                }
                                else {
                                    if (j > 0 && k === 0 && c === 0) {
                                        result += " ";
                                    }
                                    result += characters[c];
                                    spaceLeft -= characterWidth;
                                }
                            }
                        }
                        else if (this._style.breakWords) {
                            result += parts[k];
                            spaceLeft -= partWidth;
                        }
                        else {
                            var paddedPartWidth = partWidth + (k === 0 ? this.context.measureText(" ").width : 0);
                            if (j === 0 || paddedPartWidth > spaceLeft) {
                                if (j > 0) {
                                    result += "\n";
                                }
                                result += parts[k];
                                spaceLeft = wordWrapWidth - partWidth;
                            }
                            else {
                                spaceLeft -= paddedPartWidth;
                                if (k === 0) {
                                    result += " ";
                                }
                                result += parts[k];
                            }
                        }
                    }
                }
                if (i < lines.length - 1) {
                    result += '\n';
                }
            }
            return result;
        };
        MultiStyleText.prototype.updateTexture = function () {
            var texture = this._texture;
            var dropShadowPadding = this.getDropShadowPadding();
            texture.baseTexture.hasLoaded = true;
            texture.baseTexture.resolution = this.resolution;
            texture.baseTexture.realWidth = this.canvas.width;
            texture.baseTexture.realHeight = this.canvas.height;
            texture.baseTexture.width = this.canvas.width / this.resolution;
            texture.baseTexture.height = this.canvas.height / this.resolution;
            texture.trim.width = texture.frame.width = this.canvas.width / this.resolution;
            texture.trim.height = texture.frame.height = this.canvas.height / this.resolution;
            texture.trim.x = -this._style.padding - dropShadowPadding;
            texture.trim.y = -this._style.padding - dropShadowPadding;
            texture.orig.width = texture.frame.width - (this._style.padding + dropShadowPadding) * 2;
            texture.orig.height = texture.frame.height - (this._style.padding + dropShadowPadding) * 2;
            this._onTextureUpdate();
            texture.baseTexture.emit('update', texture.baseTexture);
            this.dirty = false;
        };
        MultiStyleText.prototype.assign = function (destination) {
            var sources = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sources[_i - 1] = arguments[_i];
            }
            for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
                var source = sources_1[_a];
                for (var key in source) {
                    destination[key] = source[key];
                }
            }
            return destination;
        };
        MultiStyleText.DEFAULT_TAG_STYLE = {
            align: "left",
            breakWords: false,
            dropShadow: false,
            dropShadowAngle: Math.PI / 6,
            dropShadowBlur: 0,
            dropShadowColor: "#000000",
            dropShadowDistance: 5,
            fill: "black",
            fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
            fontFamily: "Arial",
            fontSize: 26,
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal",
            letterSpacing: 0,
            lineHeight: 0,
            lineJoin: "miter",
            miterLimit: 10,
            padding: 0,
            stroke: "black",
            strokeThickness: 0,
            textBaseline: "alphabetic",
            valign: "baseline",
            wordWrap: false,
            wordWrapWidth: 100
        };
        MultiStyleText.debugOptions = {
            spans: {
                enabled: false,
                baseline: "#44BB44",
                top: "#BB4444",
                bottom: "#4444BB",
                bounding: "rgba(255, 255, 255, 0.1)",
                text: true
            },
            objects: {
                enabled: false,
                bounding: "rgba(255, 255, 255, 0.05)",
                text: true
            }
        };
        return MultiStyleText;
    }(PIXI.Text));
    exports.default = MultiStyleText;
});
},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInBpeGktbXVsdGlzdHlsZS10ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0VBLFlBQVksQ0FBQzs7SUFxRGI7UUFBNEMsa0NBQVM7UUFnRHBELHdCQUFZLElBQVksRUFBRSxNQUFvQjtZQUE5QyxZQUNDLGtCQUFNLElBQUksQ0FBQyxTQUdYO1lBREEsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O1FBQ3RCLENBQUM7UUFFRCxzQkFBVyxrQ0FBTTtpQkFBakIsVUFBa0IsTUFBb0I7Z0JBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO2dCQUVyQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUUvRSxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtvQkFDekIsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO3dCQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3ZEO3lCQUFNO3dCQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3hEO2lCQUNEO2dCQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQzs7O1dB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LEVBQUUsR0FBRyxDQUFDO1lBQzVCLGNBQWMsRUFBRSxDQUFDO1lBQ2pCLGVBQWUsRUFBRSxTQUFTO1lBQzFCLGtCQUFrQixFQUFFLENBQUM7WUFDckIsSUFBSSxFQUFFLE9BQU87WUFDYixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWU7WUFDcEQsVUFBVSxFQUFFLE9BQU87WUFDbkIsUUFBUSxFQUFFLEVBQUU7WUFDWixTQUFTLEVBQUUsUUFBUTtZQUNuQixXQUFXLEVBQUUsUUFBUTtZQUNyQixVQUFVLEVBQUUsUUFBUTtZQUNwQixhQUFhLEVBQUUsQ0FBQztZQUNoQixVQUFVLEVBQUUsQ0FBQztZQUNiLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFVBQVUsRUFBRSxFQUFFO1lBQ2QsT0FBTyxFQUFFLENBQUM7WUFDVixNQUFNLEVBQUUsT0FBTztZQUNmLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLFlBQVksRUFBRSxZQUFZO1lBQzFCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsYUFBYSxFQUFFLEdBQUc7U0FDbEIsQ0FBQztRQUVZLDJCQUFZLEdBQW9CO1lBQzdDLEtBQUssRUFBRTtnQkFDTixPQUFPLEVBQUUsS0FBSztnQkFDZCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsR0FBRyxFQUFFLFNBQVM7Z0JBQ2QsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLFFBQVEsRUFBRSwwQkFBMEI7Z0JBQ3BDLElBQUksRUFBRSxJQUFJO2FBQ1Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsSUFBSSxFQUFFLElBQUk7YUFDVjtTQUNELENBQUM7UUFrbUJILHFCQUFDO0tBOW9CRCxBQThvQkMsQ0E5b0IyQyxJQUFJLENBQUMsSUFBSSxHQThvQnBEO3NCQTlvQm9CLGNBQWMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3BpeGktbXVsdGlzdHlsZS10ZXh0XCIpLmRlZmF1bHQ7IiwiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJwaXhpLmpzXCIgLz5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXh0ZW5kZWRUZXh0U3R5bGUgZXh0ZW5kcyBQSVhJLlRleHRTdHlsZU9wdGlvbnMge1xuXHR2YWxpZ24/OiBcInRvcFwiIHwgXCJtaWRkbGVcIiB8IFwiYm90dG9tXCIgfCBcImJhc2VsaW5lXCIgfCBudW1iZXI7XG5cdGRlYnVnPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZXh0U3R5bGVTZXQge1xuXHRba2V5OiBzdHJpbmddOiBFeHRlbmRlZFRleHRTdHlsZTtcbn1cblxuaW50ZXJmYWNlIEZvbnRQcm9wZXJ0aWVzIHtcblx0YXNjZW50OiBudW1iZXI7XG5cdGRlc2NlbnQ6IG51bWJlcjtcblx0Zm9udFNpemU6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIFRleHREYXRhIHtcblx0dGV4dDogc3RyaW5nO1xuXHRzdHlsZTogRXh0ZW5kZWRUZXh0U3R5bGU7XG5cdHdpZHRoOiBudW1iZXI7XG5cdGhlaWdodDogbnVtYmVyO1xuXHRmb250UHJvcGVydGllczogRm9udFByb3BlcnRpZXM7XG5cdHRhZ05hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFRleHREcmF3aW5nRGF0YSB7XG5cdHRleHQ6IHN0cmluZztcblx0c3R5bGU6IEV4dGVuZGVkVGV4dFN0eWxlO1xuXHR4OiBudW1iZXI7XG5cdHk6IG51bWJlcjtcblx0d2lkdGg6IG51bWJlcjtcblx0YXNjZW50OiBudW1iZXI7XG5cdGRlc2NlbnQ6IG51bWJlcjtcblx0dGFnTmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1zdERlYnVnT3B0aW9ucyB7XG5cdHNwYW5zOiB7XG5cdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0YmFzZWxpbmU/OiBzdHJpbmc7XG5cdFx0dG9wPzogc3RyaW5nO1xuXHRcdGJvdHRvbT86IHN0cmluZztcblx0XHRib3VuZGluZz86IHN0cmluZztcblx0XHR0ZXh0PzogYm9vbGVhbjtcblx0fTtcblx0b2JqZWN0czoge1xuXHRcdGVuYWJsZWQ/OiBib29sZWFuO1xuXHRcdGJvdW5kaW5nPzogc3RyaW5nO1xuXHRcdHRleHQ/OiBib29sZWFuO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11bHRpU3R5bGVUZXh0IGV4dGVuZHMgUElYSS5UZXh0IHtcblx0cHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9UQUdfU1RZTEU6IEV4dGVuZGVkVGV4dFN0eWxlID0ge1xuXHRcdGFsaWduOiBcImxlZnRcIixcblx0XHRicmVha1dvcmRzOiBmYWxzZSxcblx0XHQvLyBkZWJ1ZyBpbnRlbnRpb25hbGx5IG5vdCBpbmNsdWRlZFxuXHRcdGRyb3BTaGFkb3c6IGZhbHNlLFxuXHRcdGRyb3BTaGFkb3dBbmdsZTogTWF0aC5QSSAvIDYsXG5cdFx0ZHJvcFNoYWRvd0JsdXI6IDAsXG5cdFx0ZHJvcFNoYWRvd0NvbG9yOiBcIiMwMDAwMDBcIixcblx0XHRkcm9wU2hhZG93RGlzdGFuY2U6IDUsXG5cdFx0ZmlsbDogXCJibGFja1wiLFxuXHRcdGZpbGxHcmFkaWVudFR5cGU6IFBJWEkuVEVYVF9HUkFESUVOVC5MSU5FQVJfVkVSVElDQUwsXG5cdFx0Zm9udEZhbWlseTogXCJBcmlhbFwiLFxuXHRcdGZvbnRTaXplOiAyNixcblx0XHRmb250U3R5bGU6IFwibm9ybWFsXCIsXG5cdFx0Zm9udFZhcmlhbnQ6IFwibm9ybWFsXCIsXG5cdFx0Zm9udFdlaWdodDogXCJub3JtYWxcIixcblx0XHRsZXR0ZXJTcGFjaW5nOiAwLFxuXHRcdGxpbmVIZWlnaHQ6IDAsXG5cdFx0bGluZUpvaW46IFwibWl0ZXJcIixcblx0XHRtaXRlckxpbWl0OiAxMCxcblx0XHRwYWRkaW5nOiAwLFxuXHRcdHN0cm9rZTogXCJibGFja1wiLFxuXHRcdHN0cm9rZVRoaWNrbmVzczogMCxcblx0XHR0ZXh0QmFzZWxpbmU6IFwiYWxwaGFiZXRpY1wiLFxuXHRcdHZhbGlnbjogXCJiYXNlbGluZVwiLFxuXHRcdHdvcmRXcmFwOiBmYWxzZSxcblx0XHR3b3JkV3JhcFdpZHRoOiAxMDBcblx0fTtcblxuXHRwdWJsaWMgc3RhdGljIGRlYnVnT3B0aW9uczogTXN0RGVidWdPcHRpb25zID0ge1xuXHRcdHNwYW5zOiB7XG5cdFx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRcdGJhc2VsaW5lOiBcIiM0NEJCNDRcIixcblx0XHRcdHRvcDogXCIjQkI0NDQ0XCIsXG5cdFx0XHRib3R0b206IFwiIzQ0NDRCQlwiLFxuXHRcdFx0Ym91bmRpbmc6IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpXCIsXG5cdFx0XHR0ZXh0OiB0cnVlXG5cdFx0fSxcblx0XHRvYmplY3RzOiB7XG5cdFx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRcdGJvdW5kaW5nOiBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSlcIixcblx0XHRcdHRleHQ6IHRydWVcblx0XHR9XG5cdH07XG5cblx0cHJpdmF0ZSB0ZXh0U3R5bGVzOiBUZXh0U3R5bGVTZXQ7XG5cblx0Y29uc3RydWN0b3IodGV4dDogc3RyaW5nLCBzdHlsZXM6IFRleHRTdHlsZVNldCkge1xuXHRcdHN1cGVyKHRleHQpO1xuXG5cdFx0dGhpcy5zdHlsZXMgPSBzdHlsZXM7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHN0eWxlcyhzdHlsZXM6IFRleHRTdHlsZVNldCkge1xuXHRcdHRoaXMudGV4dFN0eWxlcyA9IHt9O1xuXG5cdFx0dGhpcy50ZXh0U3R5bGVzW1wiZGVmYXVsdFwiXSA9IHRoaXMuYXNzaWduKHt9LCBNdWx0aVN0eWxlVGV4dC5ERUZBVUxUX1RBR19TVFlMRSk7XG5cblx0XHRmb3IgKGxldCBzdHlsZSBpbiBzdHlsZXMpIHtcblx0XHRcdGlmIChzdHlsZSA9PT0gXCJkZWZhdWx0XCIpIHtcblx0XHRcdFx0dGhpcy5hc3NpZ24odGhpcy50ZXh0U3R5bGVzW1wiZGVmYXVsdFwiXSwgc3R5bGVzW3N0eWxlXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnRleHRTdHlsZXNbc3R5bGVdID0gdGhpcy5hc3NpZ24oe30sIHN0eWxlc1tzdHlsZV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX3N0eWxlID0gbmV3IFBJWEkuVGV4dFN0eWxlKHRoaXMudGV4dFN0eWxlc1tcImRlZmF1bHRcIl0pO1xuXHRcdHRoaXMuZGlydHkgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIHNldFRhZ1N0eWxlKHRhZzogc3RyaW5nLCBzdHlsZTogRXh0ZW5kZWRUZXh0U3R5bGUpOiB2b2lkIHtcblx0XHRpZiAodGFnIGluIHRoaXMudGV4dFN0eWxlcykge1xuXHRcdFx0dGhpcy5hc3NpZ24odGhpcy50ZXh0U3R5bGVzW3RhZ10sIHN0eWxlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy50ZXh0U3R5bGVzW3RhZ10gPSB0aGlzLmFzc2lnbih7fSwgc3R5bGUpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3N0eWxlID0gbmV3IFBJWEkuVGV4dFN0eWxlKHRoaXMudGV4dFN0eWxlc1tcImRlZmF1bHRcIl0pO1xuXHRcdHRoaXMuZGlydHkgPSB0cnVlO1xuXHR9XG5cblx0cHVibGljIGRlbGV0ZVRhZ1N0eWxlKHRhZzogc3RyaW5nKTogdm9pZCB7XG5cdFx0aWYgKHRhZyA9PT0gXCJkZWZhdWx0XCIpIHtcblx0XHRcdHRoaXMudGV4dFN0eWxlc1tcImRlZmF1bHRcIl0gPSB0aGlzLmFzc2lnbih7fSwgTXVsdGlTdHlsZVRleHQuREVGQVVMVF9UQUdfU1RZTEUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZWxldGUgdGhpcy50ZXh0U3R5bGVzW3RhZ107XG5cdFx0fVxuXG5cdFx0dGhpcy5fc3R5bGUgPSBuZXcgUElYSS5UZXh0U3R5bGUodGhpcy50ZXh0U3R5bGVzW1wiZGVmYXVsdFwiXSk7XG5cdFx0dGhpcy5kaXJ0eSA9IHRydWU7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRUZXh0RGF0YVBlckxpbmUgKGxpbmVzOiBzdHJpbmdbXSkge1xuXHRcdGxldCBvdXRwdXRUZXh0RGF0YTogVGV4dERhdGFbXVtdID0gW107XG5cdFx0bGV0IHRhZ3MgPSBPYmplY3Qua2V5cyh0aGlzLnRleHRTdHlsZXMpLmpvaW4oXCJ8XCIpO1xuXHRcdGxldCByZSA9IG5ldyBSZWdFeHAoYDxcXC8/KCR7dGFnc30pPmAsIFwiZ1wiKTtcblxuXHRcdGxldCBzdHlsZVN0YWNrID0gW3RoaXMuYXNzaWduKHt9LCB0aGlzLnRleHRTdHlsZXNbXCJkZWZhdWx0XCJdKV07XG5cdFx0bGV0IHRhZ05hbWVTdGFjayA9IFtcImRlZmF1bHRcIl07XG5cblx0XHQvLyBkZXRlcm1pbmUgdGhlIGdyb3VwIG9mIHdvcmQgZm9yIGVhY2ggbGluZVxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBsaW5lVGV4dERhdGE6IFRleHREYXRhW10gPSBbXTtcblxuXHRcdFx0Ly8gZmluZCB0YWdzIGluc2lkZSB0aGUgc3RyaW5nXG5cdFx0XHRsZXQgbWF0Y2hlczogUmVnRXhwRXhlY0FycmF5W10gPSBbXTtcblx0XHRcdGxldCBtYXRjaEFycmF5OiBSZWdFeHBFeGVjQXJyYXk7XG5cblx0XHRcdHdoaWxlIChtYXRjaEFycmF5ID0gcmUuZXhlYyhsaW5lc1tpXSkpIHtcblx0XHRcdFx0bWF0Y2hlcy5wdXNoKG1hdGNoQXJyYXkpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiB0aGVyZSBpcyBubyBtYXRjaCwgd2Ugc3RpbGwgbmVlZCB0byBhZGQgdGhlIGxpbmUgd2l0aCB0aGUgZGVmYXVsdCBzdHlsZVxuXHRcdFx0aWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdGxpbmVUZXh0RGF0YS5wdXNoKHRoaXMuY3JlYXRlVGV4dERhdGEobGluZXNbaV0sIHN0eWxlU3RhY2tbc3R5bGVTdGFjay5sZW5ndGggLSAxXSwgdGFnTmFtZVN0YWNrW3RhZ05hbWVTdGFjay5sZW5ndGggLSAxXSkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIFdlIGdvdCBhIG1hdGNoISBhZGQgdGhlIHRleHQgd2l0aCB0aGUgbmVlZGVkIHN0eWxlXG5cdFx0XHRcdGxldCBjdXJyZW50U2VhcmNoSWR4ID0gMDtcblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBtYXRjaGVzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0Ly8gaWYgaW5kZXggPiAwLCBpdCBtZWFucyB3ZSBoYXZlIGNoYXJhY3RlcnMgYmVmb3JlIHRoZSBtYXRjaCxcblx0XHRcdFx0XHQvLyBzbyB3ZSBuZWVkIHRvIGFkZCBpdCB3aXRoIHRoZSBkZWZhdWx0IHN0eWxlXG5cdFx0XHRcdFx0aWYgKG1hdGNoZXNbal0uaW5kZXggPiBjdXJyZW50U2VhcmNoSWR4KSB7XG5cdFx0XHRcdFx0XHRsaW5lVGV4dERhdGEucHVzaCh0aGlzLmNyZWF0ZVRleHREYXRhKFxuXHRcdFx0XHRcdFx0XHRsaW5lc1tpXS5zdWJzdHJpbmcoY3VycmVudFNlYXJjaElkeCwgbWF0Y2hlc1tqXS5pbmRleCksXG5cdFx0XHRcdFx0XHRcdHN0eWxlU3RhY2tbc3R5bGVTdGFjay5sZW5ndGggLSAxXSxcblx0XHRcdFx0XHRcdFx0dGFnTmFtZVN0YWNrW3RhZ05hbWVTdGFjay5sZW5ndGggLSAxXVxuXHRcdFx0XHRcdFx0KSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKG1hdGNoZXNbal1bMF1bMV0gPT09IFwiL1wiKSB7IC8vIHJlc2V0IHRoZSBzdHlsZSBpZiBlbmQgb2YgdGFnXG5cdFx0XHRcdFx0XHRpZiAoc3R5bGVTdGFjay5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0XHRcdHN0eWxlU3RhY2sucG9wKCk7XG5cdFx0XHRcdFx0XHRcdHRhZ05hbWVTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgeyAvLyBzZXQgdGhlIGN1cnJlbnQgc3R5bGVcblx0XHRcdFx0XHRcdHN0eWxlU3RhY2sucHVzaCh0aGlzLmFzc2lnbih7fSwgc3R5bGVTdGFja1tzdHlsZVN0YWNrLmxlbmd0aCAtIDFdLCB0aGlzLnRleHRTdHlsZXNbbWF0Y2hlc1tqXVsxXV0pKTtcblx0XHRcdFx0XHRcdHRhZ05hbWVTdGFjay5wdXNoKG1hdGNoZXNbal1bMV0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHVwZGF0ZSB0aGUgY3VycmVudCBzZWFyY2ggaW5kZXhcblx0XHRcdFx0XHRjdXJyZW50U2VhcmNoSWR4ID0gbWF0Y2hlc1tqXS5pbmRleCArIG1hdGNoZXNbal1bMF0ubGVuZ3RoO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gaXMgdGhlcmUgYW55IGNoYXJhY3RlciBsZWZ0P1xuXHRcdFx0XHRpZiAoY3VycmVudFNlYXJjaElkeCA8IGxpbmVzW2ldLmxlbmd0aCkge1xuXHRcdFx0XHRcdGxpbmVUZXh0RGF0YS5wdXNoKHRoaXMuY3JlYXRlVGV4dERhdGEoXG5cdFx0XHRcdFx0XHRsaW5lc1tpXS5zdWJzdHJpbmcoY3VycmVudFNlYXJjaElkeCksXG5cdFx0XHRcdFx0XHRzdHlsZVN0YWNrW3N0eWxlU3RhY2subGVuZ3RoIC0gMV0sXG5cdFx0XHRcdFx0XHR0YWdOYW1lU3RhY2tbdGFnTmFtZVN0YWNrLmxlbmd0aCAtIDFdXG5cdFx0XHRcdFx0KSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b3V0cHV0VGV4dERhdGEucHVzaChsaW5lVGV4dERhdGEpO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRUZXh0RGF0YTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0Rm9udFN0cmluZyhzdHlsZTogRXh0ZW5kZWRUZXh0U3R5bGUpOiBzdHJpbmcge1xuXHRcdHJldHVybiBuZXcgUElYSS5UZXh0U3R5bGUoc3R5bGUpLnRvRm9udFN0cmluZygpO1xuXHR9XG5cblx0cHJpdmF0ZSBjcmVhdGVUZXh0RGF0YSh0ZXh0OiBzdHJpbmcsIHN0eWxlOiBFeHRlbmRlZFRleHRTdHlsZSwgdGFnTmFtZTogc3RyaW5nKTogVGV4dERhdGEge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZXh0LFxuXHRcdFx0c3R5bGUsXG5cdFx0XHR3aWR0aDogMCxcblx0XHRcdGhlaWdodDogMCxcblx0XHRcdGZvbnRQcm9wZXJ0aWVzOiB1bmRlZmluZWQsXG5cdFx0XHR0YWdOYW1lXG5cdFx0fTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RHJvcFNoYWRvd1BhZGRpbmcoKTogbnVtYmVyIHtcblx0XHRsZXQgbWF4RGlzdGFuY2UgPSAwO1xuXHRcdGxldCBtYXhCbHVyID0gMDtcblxuXHRcdCBPYmplY3Qua2V5cyh0aGlzLnRleHRTdHlsZXMpLmZvckVhY2goKHN0eWxlS2V5KSA9PiB7XG5cdFx0XHRsZXQgeyBkcm9wU2hhZG93RGlzdGFuY2UsIGRyb3BTaGFkb3dCbHVyIH0gPSB0aGlzLnRleHRTdHlsZXNbc3R5bGVLZXldO1xuXHRcdFx0bWF4RGlzdGFuY2UgPSBNYXRoLm1heChtYXhEaXN0YW5jZSwgZHJvcFNoYWRvd0Rpc3RhbmNlIHx8IDApO1xuXHRcdFx0bWF4Qmx1ciA9IE1hdGgubWF4KG1heEJsdXIsIGRyb3BTaGFkb3dCbHVyIHx8IDApO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIG1heERpc3RhbmNlICsgbWF4Qmx1cjtcblx0fVxuXG5cdHB1YmxpYyB1cGRhdGVUZXh0KCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5kaXJ0eSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5yZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9uO1xuXHRcdGxldCB0ZXh0U3R5bGVzID0gdGhpcy50ZXh0U3R5bGVzO1xuXHRcdGxldCBvdXRwdXRUZXh0ID0gdGhpcy50ZXh0O1xuXG5cdFx0aWYodGhpcy5fc3R5bGUud29yZFdyYXApIHtcblx0XHRcdG91dHB1dFRleHQgPSB0aGlzLndvcmRXcmFwKHRoaXMudGV4dCk7XG5cdFx0fVxuXG5cdFx0Ly8gc3BsaXQgdGV4dCBpbnRvIGxpbmVzXG5cdFx0bGV0IGxpbmVzID0gb3V0cHV0VGV4dC5zcGxpdCgvKD86XFxyXFxufFxccnxcXG4pLyk7XG5cblx0XHQvLyBnZXQgdGhlIHRleHQgZGF0YSB3aXRoIHNwZWNpZmljIHN0eWxlc1xuXHRcdGxldCBvdXRwdXRUZXh0RGF0YSA9IHRoaXMuX2dldFRleHREYXRhUGVyTGluZShsaW5lcyk7XG5cblx0XHQvLyBjYWxjdWxhdGUgdGV4dCB3aWR0aCBhbmQgaGVpZ2h0XG5cdFx0bGV0IGxpbmVXaWR0aHM6IG51bWJlcltdID0gW107XG5cdFx0bGV0IGxpbmVZTWluczogbnVtYmVyW10gPSBbXTtcblx0XHRsZXQgbGluZVlNYXhzOiBudW1iZXJbXSA9IFtdO1xuXHRcdGxldCBiYXNlbGluZXM6IG51bWJlcltdID0gW107XG5cdFx0bGV0IG1heExpbmVXaWR0aCA9IDA7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgbGluZVdpZHRoID0gMDtcblx0XHRcdGxldCBsaW5lWU1pbiA9IDA7XG5cdFx0XHRsZXQgbGluZVlNYXggPSAwO1xuXHRcdFx0bGV0IGJhc2VsaW5lID0gMDtcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgb3V0cHV0VGV4dERhdGFbaV0ubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0bGV0IHN0eSA9IG91dHB1dFRleHREYXRhW2ldW2pdLnN0eWxlO1xuXG5cdFx0XHRcdHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5nZXRGb250U3RyaW5nKHN0eSk7XG5cblx0XHRcdFx0Ly8gc2F2ZSB0aGUgd2lkdGhcblx0XHRcdFx0b3V0cHV0VGV4dERhdGFbaV1bal0ud2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQob3V0cHV0VGV4dERhdGFbaV1bal0udGV4dCkud2lkdGg7XG5cblx0XHRcdFx0aWYgKG91dHB1dFRleHREYXRhW2ldW2pdLnRleHQubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0b3V0cHV0VGV4dERhdGFbaV1bal0ud2lkdGggKz0gKG91dHB1dFRleHREYXRhW2ldW2pdLnRleHQubGVuZ3RoIC0gMSkgKiBzdHkubGV0dGVyU3BhY2luZztcblxuXHRcdFx0XHRcdGlmIChqID4gMCkge1xuXHRcdFx0XHRcdFx0bGluZVdpZHRoICs9IHN0eS5sZXR0ZXJTcGFjaW5nIC8gMjsgLy8gc3BhY2luZyBiZWZvcmUgZmlyc3QgY2hhcmFjdGVyXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGogPCBvdXRwdXRUZXh0RGF0YVtpXS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRsaW5lV2lkdGggKz0gc3R5LmxldHRlclNwYWNpbmcgLyAyOyAvLyBzcGFjaW5nIGFmdGVyIGxhc3QgY2hhcmFjdGVyXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGluZVdpZHRoICs9IG91dHB1dFRleHREYXRhW2ldW2pdLndpZHRoO1xuXG5cdFx0XHRcdC8vIHNhdmUgdGhlIGZvbnQgcHJvcGVydGllc1xuXHRcdFx0XHRvdXRwdXRUZXh0RGF0YVtpXVtqXS5mb250UHJvcGVydGllcyA9IFBJWEkuVGV4dE1ldHJpY3MubWVhc3VyZUZvbnQodGhpcy5jb250ZXh0LmZvbnQpO1xuXG5cdFx0XHRcdC8vIHNhdmUgdGhlIGhlaWdodFxuXHRcdFx0XHRvdXRwdXRUZXh0RGF0YVtpXVtqXS5oZWlnaHQgPVxuXHRcdFx0XHRcdFx0b3V0cHV0VGV4dERhdGFbaV1bal0uZm9udFByb3BlcnRpZXMuZm9udFNpemUgKyBvdXRwdXRUZXh0RGF0YVtpXVtqXS5zdHlsZS5zdHJva2VUaGlja25lc3M7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiBzdHkudmFsaWduID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0bGluZVlNaW4gPSBNYXRoLm1pbihsaW5lWU1pbiwgc3R5LnZhbGlnbiAtIG91dHB1dFRleHREYXRhW2ldW2pdLmZvbnRQcm9wZXJ0aWVzLmRlc2NlbnQpO1xuXHRcdFx0XHRcdGxpbmVZTWF4ID0gTWF0aC5tYXgobGluZVlNYXgsIHN0eS52YWxpZ24gKyBvdXRwdXRUZXh0RGF0YVtpXVtqXS5mb250UHJvcGVydGllcy5hc2NlbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxpbmVZTWluID0gTWF0aC5taW4obGluZVlNaW4sIC1vdXRwdXRUZXh0RGF0YVtpXVtqXS5mb250UHJvcGVydGllcy5kZXNjZW50KTtcblx0XHRcdFx0XHRsaW5lWU1heCA9IE1hdGgubWF4KGxpbmVZTWF4LCBvdXRwdXRUZXh0RGF0YVtpXVtqXS5mb250UHJvcGVydGllcy5hc2NlbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGxpbmVXaWR0aHNbaV0gPSBsaW5lV2lkdGg7XG5cdFx0XHRsaW5lWU1pbnNbaV0gPSBsaW5lWU1pbjtcblx0XHRcdGxpbmVZTWF4c1tpXSA9IGxpbmVZTWF4O1xuXHRcdFx0bWF4TGluZVdpZHRoID0gTWF0aC5tYXgobWF4TGluZVdpZHRoLCBsaW5lV2lkdGgpO1xuXHRcdH1cblxuXHRcdC8vIHRyYW5zZm9ybSBzdHlsZXMgaW4gYXJyYXlcblx0XHRsZXQgc3R5bGVzQXJyYXkgPSBPYmplY3Qua2V5cyh0ZXh0U3R5bGVzKS5tYXAoKGtleSkgPT4gdGV4dFN0eWxlc1trZXldKTtcblxuXHRcdGxldCBtYXhTdHJva2VUaGlja25lc3MgPSBzdHlsZXNBcnJheS5yZWR1Y2UoKHByZXYsIGN1cikgPT4gTWF0aC5tYXgocHJldiwgY3VyLnN0cm9rZVRoaWNrbmVzcyB8fCAwKSwgMCk7XG5cblx0XHRsZXQgZHJvcFNoYWRvd1BhZGRpbmcgPSB0aGlzLmdldERyb3BTaGFkb3dQYWRkaW5nKCk7XG5cblx0XHRsZXQgdG90YWxIZWlnaHQgPSBsaW5lWU1heHMucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyBjdXIsIDApIC0gbGluZVlNaW5zLnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2ICsgY3VyLCAwKTtcblxuXHRcdC8vIGRlZmluZSB0aGUgcmlnaHQgd2lkdGggYW5kIGhlaWdodFxuXHRcdGxldCB3aWR0aCA9IG1heExpbmVXaWR0aCArIG1heFN0cm9rZVRoaWNrbmVzcyArIDIgKiBkcm9wU2hhZG93UGFkZGluZztcblx0XHRsZXQgaGVpZ2h0ID0gdG90YWxIZWlnaHQgKyAyICogZHJvcFNoYWRvd1BhZGRpbmc7XG5cblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9ICh3aWR0aCArIHRoaXMuY29udGV4dC5saW5lV2lkdGgpICogdGhpcy5yZXNvbHV0aW9uO1xuXHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IGhlaWdodCAqIHRoaXMucmVzb2x1dGlvbjtcblxuXHRcdHRoaXMuY29udGV4dC5zY2FsZSh0aGlzLnJlc29sdXRpb24sIHRoaXMucmVzb2x1dGlvbik7XG5cblx0XHR0aGlzLmNvbnRleHQudGV4dEJhc2VsaW5lID0gXCJhbHBoYWJldGljXCI7XG5cdFx0dGhpcy5jb250ZXh0LmxpbmVKb2luID0gXCJyb3VuZFwiO1xuXG5cdFx0bGV0IGJhc2VQb3NpdGlvblkgPSBkcm9wU2hhZG93UGFkZGluZztcblxuXHRcdGxldCBkcmF3aW5nRGF0YTogVGV4dERyYXdpbmdEYXRhW10gPSBbXTtcblxuXHRcdC8vIENvbXB1dGUgdGhlIGRyYXdpbmcgZGF0YVxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0VGV4dERhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBsaW5lID0gb3V0cHV0VGV4dERhdGFbaV07XG5cdFx0XHRsZXQgbGluZVBvc2l0aW9uWDogbnVtYmVyO1xuXG5cdFx0XHRzd2l0Y2ggKHRoaXMuX3N0eWxlLmFsaWduKSB7XG5cdFx0XHRcdGNhc2UgXCJsZWZ0XCI6XG5cdFx0XHRcdFx0bGluZVBvc2l0aW9uWCA9IGRyb3BTaGFkb3dQYWRkaW5nO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJjZW50ZXJcIjpcblx0XHRcdFx0XHRsaW5lUG9zaXRpb25YID0gZHJvcFNoYWRvd1BhZGRpbmcgKyAobWF4TGluZVdpZHRoIC0gbGluZVdpZHRoc1tpXSkgLyAyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJyaWdodFwiOlxuXHRcdFx0XHRcdGxpbmVQb3NpdGlvblggPSBkcm9wU2hhZG93UGFkZGluZyArIG1heExpbmVXaWR0aCAtIGxpbmVXaWR0aHNbaV07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgbGluZS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgeyBzdHlsZSwgdGV4dCwgZm9udFByb3BlcnRpZXMsIHdpZHRoLCBoZWlnaHQsIHRhZ05hbWUgfSA9IGxpbmVbal07XG5cblx0XHRcdFx0bGluZVBvc2l0aW9uWCArPSBtYXhTdHJva2VUaGlja25lc3MgLyAyO1xuXG5cdFx0XHRcdGxldCBsaW5lUG9zaXRpb25ZID0gbWF4U3Ryb2tlVGhpY2tuZXNzIC8gMiArIGJhc2VQb3NpdGlvblkgKyBmb250UHJvcGVydGllcy5hc2NlbnQ7XG5cblx0XHRcdFx0c3dpdGNoIChzdHlsZS52YWxpZ24pIHtcblx0XHRcdFx0XHRjYXNlIFwidG9wXCI6XG5cdFx0XHRcdFx0XHQvLyBubyBuZWVkIHRvIGRvIGFueXRoaW5nXG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgXCJiYXNlbGluZVwiOlxuXHRcdFx0XHRcdFx0bGluZVBvc2l0aW9uWSArPSBsaW5lWU1heHNbaV0gLSBmb250UHJvcGVydGllcy5hc2NlbnQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgXCJtaWRkbGVcIjpcblx0XHRcdFx0XHRcdGxpbmVQb3NpdGlvblkgKz0gKGxpbmVZTWF4c1tpXSAtIGxpbmVZTWluc1tpXSAtIGZvbnRQcm9wZXJ0aWVzLmFzY2VudCAtIGZvbnRQcm9wZXJ0aWVzLmRlc2NlbnQpIC8gMjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSBcImJvdHRvbVwiOlxuXHRcdFx0XHRcdFx0bGluZVBvc2l0aW9uWSArPSBsaW5lWU1heHNbaV0gLSBsaW5lWU1pbnNbaV0gLSBmb250UHJvcGVydGllcy5hc2NlbnQgLSBmb250UHJvcGVydGllcy5kZXNjZW50O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Ly8gQSBudW1iZXIgLSBvZmZzZXQgZnJvbSBiYXNlbGluZSwgcG9zaXRpdmUgaXMgaGlnaGVyXG5cdFx0XHRcdFx0XHRsaW5lUG9zaXRpb25ZICs9IGxpbmVZTWF4c1tpXSAtIGZvbnRQcm9wZXJ0aWVzLmFzY2VudCAtIHN0eWxlLnZhbGlnbjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHN0eWxlLmxldHRlclNwYWNpbmcgPT09IDApIHtcblx0XHRcdFx0XHRkcmF3aW5nRGF0YS5wdXNoKHtcblx0XHRcdFx0XHRcdHRleHQsXG5cdFx0XHRcdFx0XHRzdHlsZSxcblx0XHRcdFx0XHRcdHg6IGxpbmVQb3NpdGlvblgsXG5cdFx0XHRcdFx0XHR5OiBsaW5lUG9zaXRpb25ZLFxuXHRcdFx0XHRcdFx0d2lkdGgsXG5cdFx0XHRcdFx0XHRhc2NlbnQ6IGZvbnRQcm9wZXJ0aWVzLmFzY2VudCxcblx0XHRcdFx0XHRcdGRlc2NlbnQ6IGZvbnRQcm9wZXJ0aWVzLmRlc2NlbnQsXG5cdFx0XHRcdFx0XHR0YWdOYW1lXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRsaW5lUG9zaXRpb25YICs9IGxpbmVbal0ud2lkdGg7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmZvbnQgPSB0aGlzLmdldEZvbnRTdHJpbmcobGluZVtqXS5zdHlsZSk7XG5cblx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHRleHQubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRcdGlmIChrID4gMCB8fCBqID4gMCkge1xuXHRcdFx0XHRcdFx0XHRsaW5lUG9zaXRpb25YICs9IHN0eWxlLmxldHRlclNwYWNpbmcgLyAyO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRkcmF3aW5nRGF0YS5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dGV4dDogdGV4dC5jaGFyQXQoayksXG5cdFx0XHRcdFx0XHRcdHN0eWxlLFxuXHRcdFx0XHRcdFx0XHR4OiBsaW5lUG9zaXRpb25YLFxuXHRcdFx0XHRcdFx0XHR5OiBsaW5lUG9zaXRpb25ZLFxuXHRcdFx0XHRcdFx0XHR3aWR0aCxcblx0XHRcdFx0XHRcdFx0YXNjZW50OiBmb250UHJvcGVydGllcy5hc2NlbnQsXG5cdFx0XHRcdFx0XHRcdGRlc2NlbnQ6IGZvbnRQcm9wZXJ0aWVzLmRlc2NlbnQsXG5cdFx0XHRcdFx0XHRcdHRhZ05hbWVcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRsaW5lUG9zaXRpb25YICs9IHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0LmNoYXJBdChrKSkud2lkdGg7XG5cblx0XHRcdFx0XHRcdGlmIChrIDwgdGV4dC5sZW5ndGggLSAxIHx8IGogPCBsaW5lLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdFx0bGluZVBvc2l0aW9uWCArPSBzdHlsZS5sZXR0ZXJTcGFjaW5nIC8gMjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsaW5lUG9zaXRpb25YIC09IG1heFN0cm9rZVRoaWNrbmVzcyAvIDI7XG5cdFx0XHR9XG5cblx0XHRcdGJhc2VQb3NpdGlvblkgKz0gbGluZVlNYXhzW2ldIC0gbGluZVlNaW5zW2ldO1xuXHRcdH1cblxuXHRcdHRoaXMuY29udGV4dC5zYXZlKCk7XG5cblx0XHQvLyBGaXJzdCBwYXNzOiBkcmF3IHRoZSBzaGFkb3dzIG9ubHlcblx0XHRkcmF3aW5nRGF0YS5mb3JFYWNoKCh7IHN0eWxlLCB0ZXh0LCB4LCB5IH0pID0+IHtcblx0XHRcdGlmICghc3R5bGUuZHJvcFNoYWRvdykge1xuXHRcdFx0XHRyZXR1cm47IC8vIFRoaXMgdGV4dCBkb2Vzbid0IGhhdmUgYSBzaGFkb3dcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jb250ZXh0LmZvbnQgPSB0aGlzLmdldEZvbnRTdHJpbmcoc3R5bGUpO1xuXG5cdFx0XHRsZXQgZHJvcEZpbGxTdHlsZSA9IHN0eWxlLmRyb3BTaGFkb3dDb2xvcjtcblx0XHRcdGlmICh0eXBlb2YgZHJvcEZpbGxTdHlsZSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRkcm9wRmlsbFN0eWxlID0gUElYSS51dGlscy5oZXgyc3RyaW5nKGRyb3BGaWxsU3R5bGUpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5jb250ZXh0LnNoYWRvd0NvbG9yID0gZHJvcEZpbGxTdHlsZTtcblx0XHRcdHRoaXMuY29udGV4dC5zaGFkb3dCbHVyID0gc3R5bGUuZHJvcFNoYWRvd0JsdXI7XG5cdFx0XHR0aGlzLmNvbnRleHQuc2hhZG93T2Zmc2V0WCA9IE1hdGguY29zKHN0eWxlLmRyb3BTaGFkb3dBbmdsZSkgKiBzdHlsZS5kcm9wU2hhZG93RGlzdGFuY2UgKiB0aGlzLnJlc29sdXRpb247XG5cdFx0XHR0aGlzLmNvbnRleHQuc2hhZG93T2Zmc2V0WSA9IE1hdGguc2luKHN0eWxlLmRyb3BTaGFkb3dBbmdsZSkgKiBzdHlsZS5kcm9wU2hhZG93RGlzdGFuY2UgKiB0aGlzLnJlc29sdXRpb247XG5cblx0XHRcdHRoaXMuY29udGV4dC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcblx0XHR9KTtcblxuXHRcdHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cblx0XHQvLyBTZWNvbmQgcGFzczogZHJhdyBzdHJva2VzIGFuZCBmaWxsc1xuXHRcdGRyYXdpbmdEYXRhLmZvckVhY2goKHsgc3R5bGUsIHRleHQsIHgsIHksIHdpZHRoLCBhc2NlbnQsIGRlc2NlbnQsIHRhZ05hbWUgfSkgPT4ge1xuXHRcdFx0dGhpcy5jb250ZXh0LmZvbnQgPSB0aGlzLmdldEZvbnRTdHJpbmcoc3R5bGUpO1xuXG5cdFx0XHRsZXQgc3Ryb2tlU3R5bGUgPSBzdHlsZS5zdHJva2U7XG5cdFx0XHRpZiAodHlwZW9mIHN0cm9rZVN0eWxlID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdHN0cm9rZVN0eWxlID0gUElYSS51dGlscy5oZXgyc3RyaW5nKHN0cm9rZVN0eWxlKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGU7XG5cdFx0XHR0aGlzLmNvbnRleHQubGluZVdpZHRoID0gc3R5bGUuc3Ryb2tlVGhpY2tuZXNzO1xuXG5cdFx0XHQvLyBzZXQgY2FudmFzIHRleHQgc3R5bGVzXG5cdFx0XHRsZXQgZmlsbFN0eWxlID0gc3R5bGUuZmlsbDtcblx0XHRcdGlmICh0eXBlb2YgZmlsbFN0eWxlID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdGZpbGxTdHlsZSA9IFBJWEkudXRpbHMuaGV4MnN0cmluZyhmaWxsU3R5bGUpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGZpbGxTdHlsZSkpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBmaWxsU3R5bGUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRsZXQgZmlsbCA9IGZpbGxTdHlsZVtpXTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGZpbGwgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRcdGZpbGxTdHlsZVtpXSA9IFBJWEkudXRpbHMuaGV4MnN0cmluZyhmaWxsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLl9nZW5lcmF0ZUZpbGxTdHlsZShuZXcgUElYSS5UZXh0U3R5bGUoc3R5bGUpLCBbdGV4dF0pIGFzIHN0cmluZyB8IENhbnZhc0dyYWRpZW50O1xuXHRcdFx0Ly8gVHlwZWNhc3QgcmVxdWlyZWQgZm9yIHByb3BlciB0eXBlY2hlY2tpbmdcblxuXHRcdFx0aWYgKHN0eWxlLnN0cm9rZSAmJiBzdHlsZS5zdHJva2VUaGlja25lc3MpIHtcblx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVRleHQodGV4dCwgeCwgeSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzdHlsZS5maWxsKSB7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGRlYnVnU3BhbiA9IHN0eWxlLmRlYnVnID09PSB1bmRlZmluZWRcblx0XHRcdFx0PyBNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMuc3BhbnMuZW5hYmxlZFxuXHRcdFx0XHQ6IHN0eWxlLmRlYnVnO1xuXG5cdFx0XHRpZiAoZGVidWdTcGFuKSB7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAxO1xuXG5cdFx0XHRcdGlmIChNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMuc3BhbnMuYm91bmRpbmcpIHtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLnNwYW5zLmJvdW5kaW5nO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy5ib3VuZGluZztcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnJlY3QoeCwgeSAtIGFzY2VudCwgd2lkdGgsIGFzY2VudCArIGRlc2NlbnQpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5maWxsKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5zdHJva2UoKTsgLy8geWVzLCB0d2ljZVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy5iYXNlbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy5iYXNlbGluZTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0Lm1vdmVUbyh4LCB5KTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQubGluZVRvKHggKyB3aWR0aCwgeSk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5zdHJva2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMuc3BhbnMudG9wKSB7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLnNwYW5zLnRvcDtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0Lm1vdmVUbyh4LCB5IC0gYXNjZW50KTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQubGluZVRvKHggKyB3aWR0aCwgeSAtIGFzY2VudCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmNsb3NlUGF0aCgpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5zdHJva2UoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMuc3BhbnMuYm90dG9tKSB7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLnNwYW5zLmJvdHRvbTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0Lm1vdmVUbyh4LCB5ICsgZGVzY2VudCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmxpbmVUbyh4ICsgd2lkdGgsIHkgKyBkZXNjZW50KTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy50ZXh0KSB7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IFwiI2ZmZmZmZlwiO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IFwiIzAwMDAwMFwiO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5mb250ID0gXCI4cHggbW9ub3NwYWNlXCI7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVRleHQodGFnTmFtZSwgeCwgeSAtIGFzY2VudCArIDgpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5maWxsVGV4dCh0YWdOYW1lLCB4LCB5IC0gYXNjZW50ICsgOCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVRleHQoYCR7d2lkdGgudG9GaXhlZCgyKX14JHsoYXNjZW50ICsgZGVzY2VudCkudG9GaXhlZCgyKX1gLCB4LCB5IC0gYXNjZW50ICsgMTYpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5maWxsVGV4dChgJHt3aWR0aC50b0ZpeGVkKDIpfXgkeyhhc2NlbnQgKyBkZXNjZW50KS50b0ZpeGVkKDIpfWAsIHgsIHkgLSBhc2NlbnQgKyAxNik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMub2JqZWN0cy5lbmFibGVkKSB7XG5cdFx0XHRpZiAoTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLm9iamVjdHMuYm91bmRpbmcpIHtcblx0XHRcdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5vYmplY3RzLmJvdW5kaW5nO1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5yZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuZmlsbCgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLm9iamVjdHMudGV4dCkge1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9IFwiIzAwMDAwMFwiO1xuXHRcdFx0XHR0aGlzLmNvbnRleHQubGluZVdpZHRoID0gMjtcblx0XHRcdFx0dGhpcy5jb250ZXh0LmZvbnQgPSBcIjhweCBtb25vc3BhY2VcIjtcblx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVRleHQoYCR7d2lkdGgudG9GaXhlZCgyKX14JHtoZWlnaHQudG9GaXhlZCgyKX1gLCAwLCA4LCB3aWR0aCk7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5maWxsVGV4dChgJHt3aWR0aC50b0ZpeGVkKDIpfXgke2hlaWdodC50b0ZpeGVkKDIpfWAsIDAsIDgsIHdpZHRoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0fVxuXG5cdHByb3RlY3RlZCB3b3JkV3JhcCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdC8vIEdyZWVkeSB3cmFwcGluZyBhbGdvcml0aG0gdGhhdCB3aWxsIHdyYXAgd29yZHMgYXMgdGhlIGxpbmUgZ3Jvd3MgbG9uZ2VyIHRoYW4gaXRzIGhvcml6b250YWwgYm91bmRzLlxuXHRcdGxldCByZXN1bHQgPSAnJztcblx0XHRsZXQgdGFncyA9IE9iamVjdC5rZXlzKHRoaXMudGV4dFN0eWxlcykuam9pbihcInxcIik7XG5cdFx0bGV0IHJlID0gbmV3IFJlZ0V4cChgKDxcXC8/KCR7dGFnc30pPilgLCBcImdcIik7XG5cblx0XHRjb25zdCBsaW5lcyA9IHRleHQuc3BsaXQoXCJcXG5cIik7XG5cdFx0Y29uc3Qgd29yZFdyYXBXaWR0aCA9IHRoaXMuX3N0eWxlLndvcmRXcmFwV2lkdGg7XG5cdFx0bGV0IHN0eWxlU3RhY2sgPSBbdGhpcy5hc3NpZ24oe30sIHRoaXMudGV4dFN0eWxlc1tcImRlZmF1bHRcIl0pXTtcblx0XHR0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuZ2V0Rm9udFN0cmluZyh0aGlzLnRleHRTdHlsZXNbXCJkZWZhdWx0XCJdKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBzcGFjZUxlZnQgPSB3b3JkV3JhcFdpZHRoO1xuXHRcdFx0Y29uc3Qgd29yZHMgPSBsaW5lc1tpXS5zcGxpdChcIiBcIik7XG5cblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgd29yZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0Y29uc3QgcGFydHMgPSB3b3Jkc1tqXS5zcGxpdChyZSk7XG5cblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCBwYXJ0cy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdGlmIChyZS50ZXN0KHBhcnRzW2tdKSkge1xuXHRcdFx0XHRcdFx0cmVzdWx0ICs9IHBhcnRzW2tdO1xuXHRcdFx0XHRcdFx0aWYgKHBhcnRzW2tdWzFdID09PSBcIi9cIikge1xuXHRcdFx0XHRcdFx0XHRrKys7XG5cdFx0XHRcdFx0XHRcdHN0eWxlU3RhY2sucG9wKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRrKys7XG5cdFx0XHRcdFx0XHRcdHN0eWxlU3RhY2sucHVzaCh0aGlzLmFzc2lnbih7fSwgc3R5bGVTdGFja1tzdHlsZVN0YWNrLmxlbmd0aCAtIDFdLCB0aGlzLnRleHRTdHlsZXNbcGFydHNba11dKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuZ2V0Rm9udFN0cmluZyhzdHlsZVN0YWNrW3N0eWxlU3RhY2subGVuZ3RoIC0gMV0pO1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y29uc3QgcGFydFdpZHRoID0gdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KHBhcnRzW2tdKS53aWR0aDtcblxuXHRcdFx0XHRcdGlmICh0aGlzLl9zdHlsZS5icmVha1dvcmRzICYmIHBhcnRXaWR0aCA+IHNwYWNlTGVmdCkge1xuXHRcdFx0XHRcdFx0Ly8gUGFydCBzaG91bGQgYmUgc3BsaXQgaW4gdGhlIG1pZGRsZVxuXHRcdFx0XHRcdFx0Y29uc3QgY2hhcmFjdGVycyA9IHBhcnRzW2tdLnNwbGl0KCcnKTtcblxuXHRcdFx0XHRcdFx0aWYgKGogPiAwICYmIGsgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0ICs9IFwiIFwiO1xuXHRcdFx0XHRcdFx0XHRzcGFjZUxlZnQgLT0gdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KFwiIFwiKS53aWR0aDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgYyA9IDA7IGMgPCBjaGFyYWN0ZXJzLmxlbmd0aDsgYysrKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGNoYXJhY3RlcldpZHRoID0gdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KGNoYXJhY3RlcnNbY10pLndpZHRoO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChjaGFyYWN0ZXJXaWR0aCA+IHNwYWNlTGVmdCkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdCArPSBgXFxuJHtjaGFyYWN0ZXJzW2NdfWA7XG5cdFx0XHRcdFx0XHRcdFx0c3BhY2VMZWZ0ID0gd29yZFdyYXBXaWR0aCAtIGNoYXJhY3RlcldpZHRoO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChqID4gMCAmJiBrID09PSAwICYmIGMgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdCArPSBcIiBcIjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQgKz0gY2hhcmFjdGVyc1tjXTtcblx0XHRcdFx0XHRcdFx0XHRzcGFjZUxlZnQgLT0gY2hhcmFjdGVyV2lkdGg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYodGhpcy5fc3R5bGUuYnJlYWtXb3Jkcykge1xuXHRcdFx0XHRcdFx0cmVzdWx0ICs9IHBhcnRzW2tdO1xuXHRcdFx0XHRcdFx0c3BhY2VMZWZ0IC09IHBhcnRXaWR0aDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgcGFkZGVkUGFydFdpZHRoID1cblx0XHRcdFx0XHRcdFx0cGFydFdpZHRoICsgKGsgPT09IDAgPyB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQoXCIgXCIpLndpZHRoIDogMCk7XG5cblx0XHRcdFx0XHRcdGlmIChqID09PSAwIHx8IHBhZGRlZFBhcnRXaWR0aCA+IHNwYWNlTGVmdCkge1xuXHRcdFx0XHRcdFx0XHQvLyBTa2lwIHByaW50aW5nIHRoZSBuZXdsaW5lIGlmIGl0J3MgdGhlIGZpcnN0IHdvcmQgb2YgdGhlIGxpbmUgdGhhdCBpc1xuXHRcdFx0XHRcdFx0XHQvLyBncmVhdGVyIHRoYW4gdGhlIHdvcmQgd3JhcCB3aWR0aC5cblx0XHRcdFx0XHRcdFx0aWYgKGogPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0ICs9IFwiXFxuXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmVzdWx0ICs9IHBhcnRzW2tdO1xuXHRcdFx0XHRcdFx0XHRzcGFjZUxlZnQgPSB3b3JkV3JhcFdpZHRoIC0gcGFydFdpZHRoO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c3BhY2VMZWZ0IC09IHBhZGRlZFBhcnRXaWR0aDtcblxuXHRcdFx0XHRcdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdCArPSBcIiBcIjtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdHJlc3VsdCArPSBwYXJ0c1trXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGkgPCBsaW5lcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdHJlc3VsdCArPSAnXFxuJztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0cHJvdGVjdGVkIHVwZGF0ZVRleHR1cmUoKSB7XG5cdFx0Y29uc3QgdGV4dHVyZSA9IHRoaXMuX3RleHR1cmU7XG5cblx0XHRsZXQgZHJvcFNoYWRvd1BhZGRpbmcgPSB0aGlzLmdldERyb3BTaGFkb3dQYWRkaW5nKCk7XG5cblx0XHR0ZXh0dXJlLmJhc2VUZXh0dXJlLmhhc0xvYWRlZCA9IHRydWU7XG5cdFx0dGV4dHVyZS5iYXNlVGV4dHVyZS5yZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9uO1xuXG5cdFx0dGV4dHVyZS5iYXNlVGV4dHVyZS5yZWFsV2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aDtcblx0XHR0ZXh0dXJlLmJhc2VUZXh0dXJlLnJlYWxIZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG5cdFx0dGV4dHVyZS5iYXNlVGV4dHVyZS53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoIC8gdGhpcy5yZXNvbHV0aW9uO1xuXHRcdHRleHR1cmUuYmFzZVRleHR1cmUuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gdGhpcy5yZXNvbHV0aW9uO1xuXHRcdHRleHR1cmUudHJpbS53aWR0aCA9IHRleHR1cmUuZnJhbWUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMucmVzb2x1dGlvbjtcblx0XHR0ZXh0dXJlLnRyaW0uaGVpZ2h0ID0gdGV4dHVyZS5mcmFtZS5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyB0aGlzLnJlc29sdXRpb247XG5cblx0XHR0ZXh0dXJlLnRyaW0ueCA9IC10aGlzLl9zdHlsZS5wYWRkaW5nIC0gZHJvcFNoYWRvd1BhZGRpbmc7XG5cdFx0dGV4dHVyZS50cmltLnkgPSAtdGhpcy5fc3R5bGUucGFkZGluZyAtIGRyb3BTaGFkb3dQYWRkaW5nO1xuXG5cdFx0dGV4dHVyZS5vcmlnLndpZHRoID0gdGV4dHVyZS5mcmFtZS53aWR0aCAtICh0aGlzLl9zdHlsZS5wYWRkaW5nICsgZHJvcFNoYWRvd1BhZGRpbmcpICogMjtcblx0XHR0ZXh0dXJlLm9yaWcuaGVpZ2h0ID0gdGV4dHVyZS5mcmFtZS5oZWlnaHQgLSAodGhpcy5fc3R5bGUucGFkZGluZyArIGRyb3BTaGFkb3dQYWRkaW5nKSAqIDI7XG5cblx0XHQvLyBjYWxsIHNwcml0ZSBvblRleHR1cmVVcGRhdGUgdG8gdXBkYXRlIHNjYWxlIGlmIF93aWR0aCBvciBfaGVpZ2h0IHdlcmUgc2V0XG5cdFx0dGhpcy5fb25UZXh0dXJlVXBkYXRlKCk7XG5cblx0XHR0ZXh0dXJlLmJhc2VUZXh0dXJlLmVtaXQoJ3VwZGF0ZScsIHRleHR1cmUuYmFzZVRleHR1cmUpO1xuXG5cdFx0dGhpcy5kaXJ0eSA9IGZhbHNlO1xuXHR9XG5cblx0Ly8gTGF6eSBmaWxsIGZvciBPYmplY3QuYXNzaWduXG5cdHByaXZhdGUgYXNzaWduKGRlc3RpbmF0aW9uOiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcblx0XHRmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcykge1xuXHRcdFx0Zm9yIChsZXQga2V5IGluIHNvdXJjZSkge1xuXHRcdFx0XHRkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlc3RpbmF0aW9uO1xuXHR9XG59XG4iXX0=
