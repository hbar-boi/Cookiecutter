
exports.cookiecutter = function cookiecutter(canvas) {

    this.canvas = canvas;
    this.ctx = this.canvas.get(0).getContext('2d');

    this.image = new Image();
    this.image.onload = function() {
        this.height = canvas.get(0).height = this.image.height;
        this.width = canvas.get(0).width;
        this.ctx.drawImage(this.image, 0, 0);
    }

    this.POINT_RADIUS = 3;
    this.STROKE_STYLE = '#ffffff';
    this.FILL_STYLE = '#ffffff';

    this.active = null;
    this.holding = false;
    this.points = [];
    this.closed = false;

    this.canvas.mousedown(function(e) {
        this.active = null;
        if(e.which == 1) {
            this.holding = true;
            this.points.forEach(function(point, i) {
                if(Math.abs(point[0] - e.offsetX) < this.POINT_RADIUS * 2 &&
                    Math.abs(point[1] - e.offsetY) < this.POINT_RADIUS * 2) {
                    if(i == 0 && this.points.length >= 3) {
                        this.closed = true;
                    }
                    this.active = point;
                }
            });
            if(this.active == null && !this.closed) {
                this.active = this.points[this.points.push([e.offsetX, e.offsetY]) - 1];
            }
            this.draw();
        }
    });

    this.canvas.mousemove(function(e) {
        if(this.holding && this.active != null) {
            this.active[0] = e.offsetX;
            this.active[1] = e.offsetY;
            this.draw();
        }
    });

    this.canvas.mouseup(function(e) {
        this.holding = false;
    });

    $(document).keydown(function(e) {
        if(e.keyCode == 46 && this.active != null) {
            let index = this.points.indexOf(this.active);
            this.points.splice(index, 1);
            this.points.unshift.apply(this.points, this.points.splice(index));
            this.closed = false;
            this.draw();
        }
    });

    this.draw = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.image, 0, 0);

        this.points.forEach(function(point, i) {
            let size = (this.active == point) ? this.POINT_RADIUS + 2 : this.POINT_RADIUS;

            this.circle(point, size);
            if(i != 0) {
                this.line(this.points[i - 1], point);
            }
        });

        if(this.closed) {
            this.line(this.points[this.points.length - 1], this.points[0]);
        }
    }

    this.line = function(from, to) {
        this.ctx.beginPath();
        this.ctx.moveTo(from[0], from[1]);
        this.ctx.lineTo(to[0], to[1]);
        this.ctx.strokeStyle = this.STROKE_STYLE;
        this.ctx.stroke();
    }

    this.circle = function(center, radius, style) {
        this.ctx.beginPath();
        this.ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.FILL_STYLE;
        this.ctx.fill();
    }

    this.setImage = function(image) {
        this.image.src = image;
    }

    this.getPoints = function() {
        return this.points;
    }

    this.reset = function() {
        this.points = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    return this;
}
