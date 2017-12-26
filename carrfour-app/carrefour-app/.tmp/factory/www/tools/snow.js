Particle3D = function (material) {
    THREE.Particle.call(this, material);
    this.velocity = new THREE.Vector3(4, -4, 1); //速度;
    // this.velocity.rotateX(2);//旋转;
    this.gravity = new THREE.Vector3(0, 0, 0); //加速度;
    this.drag = 1; //速度相乘系数;
};
//Particle:粒子;
//prototype:原形;
Particle3D.prototype = new THREE.Particle();
Particle3D.prototype.constructor = Particle3D; //构造函数
Particle3D.prototype.updatePhysics = function () {
    this.velocity.multiplyScalar(this.drag); //矢量相乘函数
    this.velocity.addSelf(this.gravity); //矢量相加函数
    this.position.addSelf(this.velocity); //矢量相加函数
};
var TO_RADIANS = Math.PI / 180; //角度向弧度转换系数*
THREE.Vector3.prototype.rotateY = function (angle) {
    //绕Y轴顺时针旋转angle;
    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);
    var tempz = this.z;
    var tempx = this.x;
    this.x = (tempx * cosRY) + (tempz * sinRY);
    this.z = (tempx * -sinRY) + (tempz * cosRY);
};
THREE.Vector3.prototype.rotateX = function (angle) {
    //绕X轴顺时针旋转angle;
    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);
    var tempz = this.z;
    var tempy = this.y;
    this.y = (tempy * cosRY) + (tempz * sinRY);
    this.z = (tempy * -sinRY) + (tempz * cosRY);
};
THREE.Vector3.prototype.rotateZ = function (angle) {
    //绕Z轴顺时针旋转angle;
    cosRY = Math.cos(angle * TO_RADIANS);
    sinRY = Math.sin(angle * TO_RADIANS);
    var tempx = this.x;
    var tempy = this.y;
    this.y = (tempy * cosRY) + (tempx * sinRY);
    this.x = (tempy * -sinRY) + (tempx * cosRY);
};

function randomRange(min, max) {
    return ((Math.random() * (max - min)) + min);
}

ionic.Platform.ready(function () {

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var particle; //粒子
    var camera;
    var scene;
    var renderer;
    var starSnow = 1;
    var particles = [];
    var particleImage = new Image();
    particleImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAVFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////+UMeA9AAAAHHRSTlMBBAkUJQ5rTTswGOm81s2zopmRgXNeSCsd3olS4sNQLwAAAKVJREFUGNN1kUkWgyAQRIMg0Mg8q/e/Z5CY+LLo2vG7Hj3U6ysydT8etkz9VQZcKVWK0nV5+AU7awCN9avwo4qBrEJUCUzdnJBBpSg8Z16EHJyQaaZMnjzFEGLip2R0mXjtIPjhndbOH1xAX8ltLslra4zVPpVpv3CrPDq7b9tuXeS1fbACkYM225DRIQtQCEY/QVoiAyLrIMsjp0IOi8SAhIZE/AYm2Q1NKwkxLAAAAABJRU5ErkJggg==';


    function init(container) {

        camera = new THREE.PerspectiveCamera(60, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
        camera.position.z = 1000; //雪花的粗细以及范围,越大,雪花越小

        scene = new THREE.Scene();
        scene.add(camera);

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        var material = new THREE.ParticleBasicMaterial({
            map: new THREE.Texture(particleImage)
        });

        //这个循环内的500,是指的雪花的浓度,数值越大,则越浓.
        for (var i = 0; i < 500; i++) {
            particle = new Particle3D(material);
            particle.position.x = Math.random() * 2000 - 1500;

            particle.position.z = Math.random() * 2000 - 1500;
            particle.position.y = Math.random() * 2000 - 1500;
            particle.scale.x = particle.scale.y = 1;
            scene.add(particle);

            particles.push(particle);
        }

        container.appendChild(renderer.domElement);


        var clearMy = setInterval(loop, 1000 / 50);

        return function () {
            clearInterval(clearMy);
            $(container).remove();
        };
    }


    function loop() {
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            particle.updatePhysics();

            with(particle.position) {
                if ((y < -1000) && starSnow) {
                    y += 2000;
                }

                if (x > 1000) x -= 2000;
                else if (x < -1000) x += 2000;
                if (z > 1000) z -= 2000;
                else if (z < -1000) z += 2000;
            }
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    window._startSnowing = init;
});
