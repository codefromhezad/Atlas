function PixelRenderer(canvas_id) {
    
    this.element = document.getElementById(canvas_id);
    this.context = this.element.getContext("2d");

    this.width  = this.element.width*2;
    this.height = this.element.height*2;

    this.pixelShader = null;

    this.is_preview = false;

    this.setPixelShader = function(func) {
        this.pixelShader = func;
    }

    this.render = function(preview) {
        if( preview ) {
            this.is_preview = true;

            this.width  = this.element.width;
            this.height = this.element.height;

            var _width  = 1.0 / this.width;
            var _height = 1.0 / this.height;

            var imageData = this.context.createImageData(this.width | 0, this.height | 0);
        } else {

            var _width  = 1.0 / this.width;
            var _height = 1.0 / this.height;

            var imageData = this.context.createImageData(this.width * 0.5 | 0, this.height * 0.5 | 0);
        }

        var pixelsBuffer = [];

        // First pass
        for (var j = 0; j < this.height; j++) {
            pixelsBuffer[j] = [];

            for (var i = 0; i < this.width; i++) {
                if( this.is_preview ) {
                    pixelsBuffer[j][i] = this.pixelShader(i, j);
                } else {
                    pixelsBuffer[j][i] = this.pixelShader(i * 0.5, j * 0.5);
                }
            }
        }
        
        // Second pass. Actual rendering
        var imgIndex = 0;
        var screenIter = 2;

        if( preview ) {
            screenIter = 1;
        }
        for (var j = 0; j < this.height; j+=screenIter) {
            for (var i = 0; i < this.width; i+=screenIter) {

                var p = pixelsBuffer[j][i];
                
                if( ! preview ) {
                    var p2 = pixelsBuffer[j][i+1];
                    var p3 = pixelsBuffer[j+1][i];
                    var p4 = pixelsBuffer[j+1][i+1];

                    var r = ((p[0] + p2[0] + p3[0] + p4[0]) * 0.25) | 0;
                    var g = ((p[1] + p2[1] + p3[1] + p4[1]) * 0.25) | 0;
                    var b = ((p[2] + p2[2] + p3[2] + p4[2]) * 0.25) | 0;
                } else {
                    var r = p[0];
                    var g = p[1];
                    var b = p[2];
                }

                imageData.data[imgIndex++] = r;
                imageData.data[imgIndex++] = g;
                imageData.data[imgIndex++] = b;
                imageData.data[imgIndex++] = 255;
            }
        }

        this.context.putImageData(imageData, 0, 0);
    }
}