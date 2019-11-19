
    const video = document.querySelector('.player');
    const canvas = document.querySelector('.photo');
    const ctx = canvas.getContext('2d');
    const strip = document.querySelector('.strip');
    const snap = document.querySelector('.snap');

    function getVideo(){
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(localMediaStream => {
                // video.src = window.URL.createObjectURL(localMediaStream); // *** DEPRACATED (in Firefox at least)
                video.srcObject = localMediaStream;
                video.play();
            })
            .catch(err => {
                console.error('An issue occurred!', err);
            });
    }

    // Paint image of video player to canvas every 50ms
    function paintToCanvas(){
        const width = video.videoWidth;
        const height = video.videoHeight;
        canvas.width = width;
        canvas.height = height;

        // Grab Buttons
        const redFilter = document.querySelector('#red-effect');
        const rgbSplitFilter = document.querySelector('#rgb-split');

        return setInterval(() => {
            ctx.drawImage(video, 0, 0, width, height);

            // Take Pixels Out
            let pixels = ctx.getImageData(0, 0, width, height);

            // Adjust Pixels
            if(redFilter.checked){
                pixels = redEffect(pixels);
            } else{
                pixels;
            }
            
            if (rgbSplitFilter.checked) {
                pixels = rgbSplit(pixels);
                ctx.globalAlpha = 0.1;
            } else {
                pixels;
                ctx.globalAlpha = 1;
            }

            pixels = greenScreen(pixels);

            // Put Pixels Back
            ctx.putImageData(pixels, 0, 0)
            
        }, 50);
    }

    // Take photo for photo booth
    function takePhoto(){
        snap.currentTime = 0;
        snap.play();

        // Take Data out of canvas
        const data = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = data;
        link.setAttribute('download', 'handsome');
        link.innerHTML = `<img src="${data}" alt="handsom-man" />`
        strip.insertBefore(link, strip.firstChild);
    }

    // Red Effect
    function redEffect(pixels){
        for(let i = 0; i < pixels.data.length; i += 4){
            // Red Channel
            pixels.data[i + 0] = pixels.data[i + 0] + 100;
            // Green Channel
            pixels.data[i + 1] = pixels.data[i + 1] - 50;
            // Blue Channel
            pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
        }
        return pixels;
    }

    // RGB Split
    function rgbSplit(pixels){
        for (let i = 0; i < pixels.data.length; i += 4) {
            // Red Channel
            pixels.data[i - 150] = pixels.data[i + 0];
            // Green Channel
            pixels.data[i + 100] = pixels.data[i + 1];
            // Blue Channel
            pixels.data[i - 150] = pixels.data[i + 2];
        }
        return pixels;
    }

    // Function Green Screen
    function greenScreen(pixels){
        const levels = {};

        document.querySelectorAll('.rgb input').forEach(input => {
            levels[input.name] = input.value;
        });

        for(i = 0; i < pixels.data.length; i += 4){
            red = pixels.data[i + 0];
            green = pixels.data[i + 1];
            blue = pixels.data[i + 2];
            alpha = pixels.data[i + 3];

            if(red >= levels.rmin &&
                green >= levels.gmin &&
                blue >= levels.bmin &&
                red <= levels.rmax &&
                green <= levels.gmax &&
                blue <= levels.bmax){
                    // Take out those pixels
                    pixels.data[i + 3] = 0
                }
        }

        return pixels;
    }

    getVideo();

    video.addEventListener('canplay', paintToCanvas);
