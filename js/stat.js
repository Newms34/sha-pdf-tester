var app = angular.module('statApp', []).controller('statCont', function($scope, $sce) {
    $scope.maxDepth = 6;
    $scope.pageSrc = 'https://docs.angularjs.org'
    $scope.getUrl = function(n) {
        // $scope.ctx.clearRect(0,0,$scope.ifSize.x,$scope.ifSize.y);
        return $sce.trustAsResourceUrl(n);
    };
    $scope.ifSize = {
        x: $('#ifr').width(),
        y: $('#ifr').height()
    }
    $scope.canv = document.querySelector('canvas');
    $scope.ctx = $scope.canv.getContext("2d");
    $scope.boltCon = function(x, y,str) {
        this.x = x;
        this.y = y;
        this.str = str;
        this.pts = [x, y];
    }
    $scope.staticPg = function() {
        $scope.splitChance = .1;
        var h = $scope.ifSize.y,
            w = $scope.ifSize.x,
            numStarts = Math.ceil(Math.random() * 10),
            maxDist = Math.sqrt(Math.pow(h, 2) + Math.pow(w, 2)) * .05;
        $scope.ctx.clearRect(0, 0, $scope.ifSize.x, $scope.ifSize.y);
        $scope.ctx.fillStyle = 'rgba(0,0,0,.3)';
        $scope.ctx.fillRect(0, 0, $scope.ifSize.x, $scope.ifSize.y);
        $scope.bolts = [];
        for (var i = 0; i < numStarts; i++) {
            //setup initial entry points for bolts
            $scope.bolts.push(new $scope.boltCon(Math.floor(Math.random() * $scope.ifSize.x), 0,1));
        }
        var stopper = 20;
        while ($scope.bolts.length && stopper) {
            var boltLen = $scope.bolts.length;
            for (var b = 0; b < boltLen; b++) {

                console.log('drawing line from', $scope.bolts[b], 'iteration', stopper)
                var out = 20,
                    xDist = null,
                    yDist = null;
                while (out) {
                    var randDist = Math.random() * maxDist,
                        ang = Math.PI * Math.random(); //get random angle (in radians)
                    xDist = randDist * Math.cos(ang);
                    yDist = randDist * Math.sin(ang);
                    if ($scope.bolts[b].x + xDist > 0 && $scope.bolts[b].x < w && $scope.bolts[b].y + yDist > 0 && $scope.bolts[b].y < h) {
                        //is this end location in range?
                        out = 0;
                    } else {
                        out--;
                    }
                    console.log('attempted dir:', xDist, yDist, ang, $scope.bolts[b].x, $scope.bolts[b].y)
                }

                //update line 'base' for calcs
                $scope.bolts[b].x = $scope.bolts[b].x + xDist;
                $scope.bolts[b].y = $scope.bolts[b].y + yDist;
                $scope.bolts[b].pts.push($scope.bolts[b].x);
                $scope.bolts[b].pts.push($scope.bolts[b].y);
                $scope.bolts[b].str*=.95;
                //optionally split line
                if (Math.random() < $scope.splitChance) {
                    //bolt split!
                    console.log('Bolt', $scope.bolts[b], 'split!')
                    $scope.bolts.push(angular.copy($scope.bolts[b]));
                    // boltLen++;
                }
                //draw the line

            }
            stopper -= 1;
        }
        for (var b = 0; b < $scope.bolts.length; b++) {
            var randSize = ($scope.bolts[b].str * .8) + .2;
            $scope.ctx.strokeStyle = 'hsla(205,100%,'+100*((randSize/4)+.76)+'%,' + randSize + ')';
            $scope.ctx.lineWidth = 3 * randSize;
            $scope.ctx.shadowColor = '#acf';
            $scope.ctx.shadowBlur = 20 * randSize;
            $scope.ctx.beginPath();
            for (var i = 0; i < $scope.bolts[b].pts.length - 6; i+=6) {
                $scope.ctx.moveTo($scope.bolts[b].pts[i], $scope.bolts[b].pts[i+1]);
                $scope.ctx.bezierCurveTo($scope.bolts[b].pts[i+2], $scope.bolts[b].pts[i+3],$scope.bolts[b].pts[i+4], $scope.bolts[b].pts[i+5], $scope.bolts[b].pts[i+6], $scope.bolts[b].pts[i+7]);
                $scope.ctx.stroke();
            }
        }
    };
})
