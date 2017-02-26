var app = angular.module('boomApp', []).controller('boomCont', function($scope, $sce) {
    $scope.pageSrc = '';
    $scope.getUrl = $sce.trustAsResourceUrl;
    $scope.mouse = { x: 0, y: 0 }
    $scope.firing = false;
    $scope.booms = [];
    $scope.exploding=false;
    $scope.canv = document.querySelector('#boom-cont');
    $scope.ctx = $scope.canv.getContext("2d");
    $scope.ifSize = {
        x: $('#ifr').width(),
        y: $('#ifr').height()
    }
    $scope.fontSize = 80;
    $scope.canv.onmousemove = function(e) {
        if (!$scope.firing && $scope.pageSrc) {
            $scope.mouse.x = e.offsetX - 50;
            $scope.mouse.y = e.offsetY - 50;
            $scope.$digest();
        }
    };
    $scope.canv.onclick = function(e) {
        console.log(e)
        $scope.firing = true;
        $scope.fireProg($scope.fontSize);
    };
    $scope.timer;
    $scope.fireProg = function() {
        $scope.timer = setInterval(function() {
            if ($scope.mouse.x) $scope.mouse.x -= .4;
            if ($scope.mouse.y) $scope.mouse.y--;
            $scope.fontSize-=2;
            console.log($scope.fontSize);
            $scope.$digest();
            if ($scope.fontSize < 0) {
                clearInterval($scope.timer);
                // $scope.firing = false;
                // $scope.fontSize = 80;
                // $scope.$digest();
                $scope.doBoom();
            }
        }, 50)
    }
    $scope.doBoom = function() {
    	$scope.exploding=true;
    	$scope.$digest();
        var numBooms = Math.floor(Math.random() * 3) + 1;
        $scope.booms = [];
        for (var i = 0; i < numBooms; i++) {
            var lifeLen = Math.floor(Math.random() * 30) + 20;
            $scope.booms.push({

                life: lifeLen,
                origLife: lifeLen,
                x: $scope.mouse.x + Math.floor(Math.random() * lifeLen*2) - lifeLen,
                y: $scope.mouse.y + Math.floor(Math.random() * lifeLen*2) - lifeLen,
                startSz: Math.floor(Math.random() * 30) + 20,
                active: true
            })
        }
        $scope.timer = setInterval(function() {
            //first, adjustBooms;
            var numActive = $scope.booms.length;
            for (var j = 0; j < $scope.booms.length; j++) {
                if ($scope.booms[j].active) {
                    $scope.booms[j].life--;
                    $
                }
                if (!$scope.booms[j].life) {
                    $scope.booms[j].active = false;
                    numActive--;
                    theRad = $scope.booms[j].startSz + $scope.booms[j].origLife - $scope.booms[j].life;
                    var gradient = $scope.ctx.createRadialGradient($scope.booms[j].x, $scope.booms[j].y, theRad, $scope.booms[j].x, $scope.booms[j].y, 0);
                    gradient.addColorStop(0, "transparent");
                    gradient.addColorStop(.05, "rgba(0,0,0,.5)");
                    gradient.addColorStop(.1, "rgba(0,0,0,.8)");
                    gradient.addColorStop(1, "black");
                    $scope.ctx.fillStyle = gradient;
                    $scope.ctx.fillRect(0, 0, $scope.canv.width, $scope.canv.height);
                } else {
                    theRad = $scope.booms[j].startSz + $scope.booms[j].origLife - $scope.booms[j].life;
                    var gradient = $scope.ctx.createRadialGradient($scope.booms[j].x, $scope.booms[j].y, theRad, $scope.booms[j].x, $scope.booms[j].y, 0);
                    gradient.addColorStop(0, "transparent");
                    gradient.addColorStop(.3, "rgba(200,50,50,.5)");
                    gradient.addColorStop(.6, "rgba(250,250,50,.8)");
                    gradient.addColorStop(1, "white");
                    $scope.ctx.fillStyle = gradient;
                    $scope.ctx.fillRect(0, 0, $scope.canv.width, $scope.canv.height);
                }
            }
            console.log('Active booms',numActive)
            if (!numActive) {
                clearInterval($scope.timer);
                $scope.firing = false;
                $scope.fontSize = 80;
                $scope.exploding=false;
                $scope.$digest();
            }
        }, 50)

    }
});
