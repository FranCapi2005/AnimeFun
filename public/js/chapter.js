const container = document.querySelector(".container__chapter-see")
const mainVideo = container.querySelector("video")
const videoTimeline = container.querySelector(".video-timeline")
const progressBar = container.querySelector(".progress-bar")
const muteBtn = document.querySelector(".mute-btn")
const volumeSlider = document.querySelector(".volume-slider")
const currentVidTime = container.querySelector(".current-time")
const videoDuration = container.querySelector(".video-duration")
const closeButton = container.querySelector(".close-btn");
const skipBackward = container.querySelector(".skip-backward")
const skipForward = container.querySelector(".skip-forward")
const playPauseBtn = container.querySelector(".play-pause i")
const speedBtn = container.querySelector(".playback-speed span")
const speedOptions = container.querySelector(".speed-options")
const pipBtn = container.querySelector(".pic-in-pic svg")
const fullScreenBtn = container.querySelector(".fullscreen i")
const video = document.querySelector("video")
let timer;


/* ------------ ShortCuts ------------ */
document.addEventListener("keydown", e => {
    const tagName = document.activeElement.tagName.toLowerCase()

    if(tagName === "input") return
    
    switch (e.key.toLowerCase()) {
        case " ":
            if (tagName === "button") return
        case "k":
            togglePlay()
            break;
        case "f":
            toggleFullScreenMode()
            break;
        case "i":
            toggleMiniPlayerMode()
            break;
        case "m":
            toggleMute()
            break;
        case "arrowleft":
        case "j":
            skip(-5)
            break;
        case "arrowright":
        case "l":
            skip(5)
            break;
        default:
            break;
    }
})


/* ------------ Hide Video Controls ------------ */
const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 1000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});

function goBack() {
    window.history.back();
}


/* ------------ Timeline ------------ */
const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));



/* ------------ Volume ------------ */
muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
  video.volume = e.target.value
  video.muted = e.target.value === 0
})

function toggleMute() {
  video.muted = !video.muted
}

mainVideo.addEventListener("volumechange", () => {
    let volumeLevel;
  
    if (video.muted || video.volume === 0) {
      volumeSlider.value = 0;
      volumeLevel = "muted";
    } else {
      volumeSlider.value = video.volume;
      if (video.volume >= 0.5) {
        volumeLevel = "high";
      } else {
        volumeLevel = "low";
      }
    }
  
    container.dataset.volumeLevel = volumeLevel;
});
  

/* ------------ Skip Time Video ------------ */
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5);
skipForward.addEventListener("click", () => mainVideo.currentTime += 5);



/* ------------ Speed Controller ------------ */
speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show");
    }
});

speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show"));



/* ------------ Fullscreen Button ------------ */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        }).catch(err => {
            console.error("Error al intentar entrar en fullscreen:", err);
        });
    } else {
        document.exitFullscreen().then(() => {
            fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        }).catch(err => {
            console.error("Error al intentar salir del fullscreen:", err);
        });
    }
}
fullScreenBtn.addEventListener("click", toggleFullscreen);

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
    } else {
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    }
});



/* ------------ Shortcuts CODE ------------ */
/* ------------ Play & Stop Button |" "| ------------ */
function togglePlay() {
    video.paused ? video.play() : video.pause()
}

mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
video.addEventListener("click", togglePlay);


/* ------------ Fullscreen |F| ------------ */
function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
}


/* ------------ Mini Player Mode |I| ------------ */
function toggleMiniPlayerMode() {
    if (container.classList.contains("mini-player")) {
      document.exitPictureInPicture()
    } else {
      video.requestPictureInPicture()
    }
}

pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());


/* ------------ Skip Time Video |J| |L| ------------ */
function skip(duration) {
    video.currentTime += duration
}



/* 
CREAR UN COMPARTIR PANTALLA
el "shareScreenButton" Es un <button> con id
el "videoElement" Es un <video> con id

const shareScreenButton = document.getElementById("share-screen");
const videoElement = document.getElementById("screen-sharing-video");

shareScreenButton.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        videoElement.srcObject = stream;
        shareScreenButton.disabled = true; // Desactivar el botón después de iniciar el screen sharing
    } catch (error) {
        console.error("Error al acceder al screen sharing:", error);
    }
}); 
 */