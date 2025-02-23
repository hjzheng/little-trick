// 截取视频封面
function getVideoCover(video, callback) {
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0);
    
    callback(canvas.toDataURL("image/png"));
}

window.onload = function() {
    var video = document.getElementById("video");
    video.src = "./8416595-hd_1080_1920_25fps.mp4?t=1";
    video.play();

    var btn = document.getElementById("btn");
    btn.onclick = function() {
        getVideoCover(video, function(dataURL) {
            var img = document.createElement("img");
            img.src = dataURL;
            document.body.appendChild(img);
        });
    };
    // video.onloadeddata = function() {
    //     getVideoCover(video, function(dataURL) {
    //         document.getElementById("cover").src = dataURL;
    //     });
    // }
}