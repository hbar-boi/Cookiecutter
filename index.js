
exports.cookiecutter = function cookiecutter(canvas) {
    var self = this;

    this.canvas = canvas;
    this.ctx = this.canvas.get(0).getContext('2d');

    this.image = new Image();
    this.image.onload = function() {
        self.height = canvas.get(0).height = self.image.height;
        self.width = canvas.get(0).width;
        self.ctx.drawImage(self.image, 0, 0);
    }

    this.POINT_RADIUS = 3;
    this.STROKE_STYLE = '#ffffff';
    this.FILL_STYLE = '#ffffff';

    this.active = null;
    this.holding = false;
    this.points = [];
    this.closed = false;

    this.canvas.mousedown(function(e) {
        self.active = null;
        if(e.which == 1) {
            self.holding = true;
            self.points.forEach(function(point, i) {
                if(Math.abs(point[0] - e.offsetX) < self.POINT_RADIUS * 2 &&
                    Math.abs(point[1] - e.offsetY) < self.POINT_RADIUS * 2) {
                    if(i == 0 && self.points.length >= 3) {
                        self.closed = true;
                    }
                    self.active = point;
                }
            });
            if(self.active == null && !self.closed) {
                self.active = self.points[self.points.push([e.offsetX, e.offsetY]) - 1];
            }
            self.draw();
        }
    });

    this.canvas.mousemove(function(e) {
        if(self.holding && self.active != null) {
            self.active[0] = e.offsetX;
            self.active[1] = e.offsetY;
            self.draw();
        }
    });

    this.canvas.mouseup(function(e) {
        self.holding = false;
    });

    $(document).keydown(function(e) {
        if(e.keyCode == 46 && self.active != null) {
            let index = self.points.indexOf(self.active);
            self.points.splice(index, 1);
            self.points.unshift.apply(self.points, self.points.splice(index));
            self.closed = false;
            self.draw();
        }
    });

    this.draw = function() {
        self.ctx.clearRect(0, 0, self.width, self.height);
        self.ctx.drawImage(self.image, 0, 0);

        self.points.forEach(function(point, i) {
            let size = (self.active == point) ? self.POINT_RADIUS + 2 : self.POINT_RADIUS;

            self.circle(point, size);
            if(i != 0) {
                self.line(self.points[i - 1], point);
            }
        });

        if(self.closed) {
            self.line(self.points[self.points.length - 1], self.points[0]);
        }
    }

    this.line = function(from, to) {
        self.ctx.beginPath();
        self.ctx.moveTo(from[0], from[1]);
        self.ctx.lineTo(to[0], to[1]);
        self.ctx.strokeStyle = self.STROKE_STYLE;
        self.ctx.stroke();
    }

    this.circle = function(center, radius, style) {
        self.ctx.beginPath();
        self.ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        self.ctx.fillStyle = this.FILL_STYLE;
        self.ctx.fill();
    }

    this.setImage = function(image) {
        self.image.src = image;
    }

    this.getPoints = function() {
        return this.points;
    }

    return this;
}
