//Todo List
/**
 * 1. Render Song
 * 2. Scroll Top
 * 3. Play / Pause / Seek
 * 4. CD routate
 * 5. Random
 * 6. Next / Repeat when ended
 * 8. Active Song
 * 9. Scroll active song into view
 * 10.Play song when click
 * */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Music_Player"

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player")
const playButton = $(".btn-toggle-play")
const progress = $("#progress");
const nextButton = $(".btn-next");
const previousButton = $(".btn-prev");
const randomButton = $(".btn-random");
const repeatButton = $(".btn-repeat");
const playlist = $(".playlist");
const cd = $(".cd");
const timeStart = $("#progess-time-start");
const timeEnd = $("#progess-time-end");


const app = {
    currentIndex: 0,

    isRandom: false,
    isRepeat: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Bài Này Chill Phết",
            singer: "Đen Vâu",
            path: "./music/Bai_Nay_Chill_Phet.mp3",
            image: "./img/bai_nay_chill_phet.jpg"
        },
        {
            name: "Cảm Ơn",
            singer: "Đen Vâu",
            path: "./music/Cam_On.mp3",
            image: "./img/cam_on.jpg"
        },
        {
            name: "Cho Tôi Lang Thang",
            singer: "Đen Vâu",
            path: "./music/Cho_toi_lang_thang.mp3",
            image: "./img/cho_toi_lang_thang.jpg"
        },
        {
            name: "Cô Gái Bàn Bên",
            singer: "Đen Vâu",
            path: "./music/Co_Gai_Ban_Ben.mp3",
            image: "./img/co_gai_ban_ben.jpg"
        },
        {
            name: "Đi Theo Bóng Mặt Trời",
            singer: "Đen Vâu",
            path: "./music/Di_Theo_Bong_Mat_Troi.mp3",
            image: "./img/di_theo_bong_mat_troi.jpg"
        },
        {
            name: "Đi Về Nhà",
            singer: "Đen Vâu",
            path: "./music/Di_ve_nha.mp3",
            image: "./img/di_ve_nha.jpg"
        },
        {
            name: "Lối Nhỏ",
            singer: "Đen Vâu",
            path: "./music/Loi_nho.mp3",
            image: "./img/loi_nho.jpg"
        },
        {
            name: "Mang Tiền Về Cho Mẹ",
            singer: "Đen Vâu",
            path: "./music/Mang_Tien_Ve_Cho_Me.mp3",
            image: "./img/mang_tien_ve_cho_me.jpg"
        },
        {
            name: "Một Triệu Like",
            singer: "Đen Vâu",
            path: "./music/Mot_Trieu_Like.mp3",
            image: "./img/mot_trieu_like.jpg"
        },
        {
            name: "Mười Năm",
            singer: "Đen Vâu",
            path: "./music/Muoi_Nam.mp3",
            image: "./img/muoi_nam.jpg"
        },
        {
            name: "Đưa Nhau Đi Trốn",
            singer: "Đen Vâu",
            path: "./music/Dua_Nhau_Di_Tron.mp3",
            image: "./img/dua_nhau_di_tron.jpg"
        }
    ],
    // Cài đặt config
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    //Load config vào app
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

        //or
        //Object.assign(this, this.config)

        randomButton.classList.toggle('active', this.isRandom);
        repeatButton.classList.toggle('active', this.isRepeat);
    },

    //Render playlist
    ////   <i class="fas fa-ellipsis-h"></i> dau 3 cham
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div data-index="${index}" class="song ${index === this.currentIndex ? "active" : ""}">
            <div
              class="thumb"
              style="
                background-image: url('${song.image}');
              "
            ></div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-times"></i>
            </div>
          </div>
          `
        })
        playlist.innerHTML = htmls.join("");
    },

    //Xử lý tất cả các event trong app
    handleEvents: function () {

        const _this = this;

        // Xử lý phóng to , thu nhỏ cd
        const cdWidth = cd.offsetWidth;

        // Lắng nghe / Xử lý sự kiện khi cuộn xuống thì thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop

            const new_cdWidth = cdWidth - (scrollTop / 1.5);
            // new_cdWidth có thể nhận giá trị âm
            // khi đó cd.style.width sẽ không nhận 
            cd.style.width = new_cdWidth > 0 ? new_cdWidth + "px" : 0;
            cd.style.opacity = new_cdWidth / cdWidth;
            // cd.style.transition =`all linear`
        }

        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: "rotate(360deg)"
                }
            ],
            {
                duration: 10000, // thời gian quay hết một vòng
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause();


        //Lắng nghe / Xử lý khi click play
        playButton.onclick = function () {
            audio.play();
            player.classList.toggle('playing');
            cdThumbAnimate.play();
            if (!player.classList.contains('playing')) {
                audio.pause();
                cdThumbAnimate.pause();
            }
        }

        //Lắng nghe / Xử lý tiến độ bài hát thay đổi -> Chạy thanh progress
        audio.ontimeupdate = function () {
            // console.log(audio.currentTime); //In ra thời gian bài hát hiện tại
            if (audio.duration) //Tổng thời gian của một bài hát
            {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.value = progressPercent;
                // console.log(progressPercent)
                var color = 'linear-gradient(90deg, rgb(236, 31, 85)' + progressPercent + '% , rgb(214, 214, 214)' + progressPercent + '%)';
                progress.style.background = color;

                var end = Math.floor(audio.duration / 60);
                timeEnd.innerHTML = `${end}:${Math.floor(((audio.duration / 60) - end)*60)}`;

                var start = audio.currentTime;
                var seconds = Math.floor(start);
                
                timeStart.innerHTML = `${Math.floor(seconds/60)}:${Math.floor(seconds%60) < 10 ? "0"+Math.floor(seconds%60) : Math.floor(seconds%60)}`;
            }

        }

        //Lắng nghe / Xử lý sự kiện tua nhanh bài hát 
        // Chỗ này để onchange sẽ bị giật
        progress.oninput = function () {
            if (audio.duration) //Tổng thời gian của một bài hát
            {
                const seektime = (progress.value / 100) * audio.duration;
                audio.currentTime = seektime;
                // console.log(audio.currentTime);
            }
        }
        // Lắng nghe sự kiện chuyển bài kế tiếp
        nextButton.onclick = function () {
            if (_this.isRandom)
                _this.randomSong();
            else
                _this.nextSong(); // _this o day la app, con this la nextButton
            audio.play();
            player.classList.add('playing');
            cdThumbAnimate.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Lắng nghe sự kiện chuyển bài ở trước
        previousButton.onclick = function () {
            if (_this.isRandom)
                _this.randomSong();
            else
                _this.preSong(); // _this o day la app, con this la previousButton
            audio.play();
            player.classList.add('playing');
            cdThumbAnimate.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Lắng nghe sự kiện phát ngẫu nhiên bài hát
        randomButton.onclick = function () {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);

            // Cài đặt config
            _this.setConfig("isRandom", _this.isRandom);
        }

        //Lắng nghe sự kiện lặp lại bài hát hiện tại
        repeatButton.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);

            // Cài đặt config
            _this.setConfig("isRepeat", _this.isRepeat);
        }

        //Lắng nghe / Xử lý sự kiện khi nghe hết 1 bài -> tự động chuyển sanng bài khác
        //Nếu đang ở chế độ lặp lại thì sẽ lặp lại bài hát chứ không chuyển sanng bài khác
        audio.onended = function () {
            if (_this.isRepeat)
                audio.play();
            else
                nextButton.onclick();
        }
        //Lắng nghe / Xử lý sự kiện khi chọn một bài để nghe
        playlist.onclick = function (e) {
            if (e.target.closest('.song:not(.active)') || e.target.closest(".option")) {
                if(e.target.closest(".option"))// Xử lý khi bấm vào option
                {
                    const index  = Number(e.target.closest('.song').dataset.index); //lấy data index của song lấy được
                    _this.songs.splice(index , 1);
                    if(index == _this.currentIndex)
                    {
                        _this.currentIndex--;
                        _this.nextSong();
                        audio.play();
                    }   
                    _this.render();
                }
                else if (e.target.closest('.song:not(.active)')) {
                    //Convert to number
                    _this.currentIndex = Number(e.target.closest('.song').dataset.index);
                    // console.log(_this.currentIndex);
                    _this.loadCurrentSong();
                    audio.play();
                    player.classList.add('playing');
                    cdThumbAnimate.play();
                    _this.render();
                }
                
            }
        }
    },

    //Định nghĩa các custom Property cho app
    defineProperty: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function () {

        heading.innerHTML = this.currentSong.name;
        cdThumb.style.backgroundImage = "url(" + this.currentSong.image + ")";
        audio.src = this.currentSong.path
    },
    // Xử lý sự kiện chuyển bài kế tiếp
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // Xử lý sự kiện chuyển bài ở trước
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    // Xử lý sự kiện phát ngẫu nhiên bài hát
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentSong)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        setTimeout(function () {
            //The Element interface's scrollIntoView() method scrolls the element's parent container 
            //such that the element on which scrollIntoView() is called is visible to the user.
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }, 500)
    },


    start: function () {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        //Định nghĩa các custom Property cho app
        this.defineProperty();

        //Lắng nghe || Xử lý tất cả các event trong app
        this.handleEvents();

        this.loadCurrentSong();

        //Render playlist
        this.render();





        
    }
}

app.start()

// var slider = document.getElementById("progress");

// var start_value = slider.getAttribute("value");

// var x = start_value;
// var color = 'linear-gradient(90deg, rgb(236, 31, 85)' + x + '% , rgb(214, 214, 214)' + x + '%)';
// slider.style.background = color;

// slider.addEventListener("mousemove", function() {
//     x = slider.value;
//     color = 'linear-gradient(90deg, rgb(236, 31, 85)' + x + '% , rgb(214, 214, 214)' + x + '%)';
//     slider.style.background = color;
// });


