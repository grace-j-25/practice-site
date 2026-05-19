document.addEventListener("DOMContentLoaded", function () {
    
    // GSAP 및 ScrollTrigger 안전 검증 및 등록
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ==========================================
    // 1. 커스텀 마우스 무브 로직 보완
    // ==========================================
    const cursor = document.querySelector(".hip-cursor");
    const follower = document.querySelector(".hip-cursor-follower");

    if (cursor && follower && typeof gsap !== "undefined") {
        document.addEventListener("mousemove", (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.15 });
        });

        // 카드, 링크, 새로 만든 버튼 호버 시 동그라미 반전 및 확대 연동
        document.querySelectorAll(".bento-card, .hip-work-row, .r-card, .w-single-btn, .h-nav a, .h-logo, #inspect-trigger-btn").forEach((elem) => {
            elem.addEventListener("mouseenter", () => {
                gsap.to(follower, { scale: 1.6, backgroundColor: "rgba(26, 156, 0, 0.1)", borderColor: "#1A9C00", duration: 0.3 });
            });
            elem.addEventListener("mouseleave", () => {
                const isLight = document.body.classList.contains("theme-light");
                gsap.to(follower, { scale: 1, backgroundColor: "transparent", borderColor: isLight ? "#000000" : "#ffffff", duration: 0.3 });
            });
        });
    }

    // ==========================================
    // 2. HERO 및 본페이지 애니메이션 (사이트 진입 즉시 실행)
    // ==========================================
    if (typeof gsap !== "undefined") {
        // 타이포그래피가 아래에서 위로 묵직하게 올라오는 모션
        gsap.from(".hero-title", { 
            y: 80, 
            opacity: 0, 
            duration: 1.4, 
            stagger: 0.2, 
            ease: "power4.out" 
        });

        // 환영 문구 가이드라인 스윽 늘어나며 등장
        gsap.from(".hero-welcome-wrap", { 
            x: -40, 
            opacity: 0, 
            duration: 1.2, 
            delay: 0.5, 
            ease: "power3.out" 
        });

        // 오른쪽 개발자 모드 버튼 위젯이 페이드인되며 살짝 솟아오르는 모션
        if (document.querySelector(".cheat-btn")) {
            gsap.from(".cheat-btn", {
                y: 30,
                opacity: 0,
                duration: 1.2,
                delay: 0.3,
                ease: "power3.out"
            });
        }

        // BENTO GRID 등장 애니메이션 (ScrollTrigger 검증)
        if (typeof ScrollTrigger !== "undefined" && document.querySelector(".bento-grid") && document.querySelector(".bento-card")) {
            gsap.from(".bento-card", {
                scrollTrigger: {
                    trigger: ".bento-grid",
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }

    // ==========================================
    // 3. 거대 버튼 개발자 모드 토글 로직
    // ==========================================
    const inspectBtn = document.getElementById("inspect-trigger-btn");
    const btnStatusText = document.querySelector(".btn-status");
    const btnTitleText = document.querySelector(".btn-title");

    if (inspectBtn) {
        inspectBtn.addEventListener("click", function () {
            // body에 클래스 토글
            const isInspectActive = document.body.classList.toggle("is-inspect");
            
            if (isInspectActive) {
                // ACTIVE 상태
                if (btnStatusText) btnStatusText.innerText = "SYSTEM : ON (ACTIVE)";
                if (btnTitleText) btnTitleText.innerHTML = "개발자 모드<br>DEACTIVATE ↩";
                
                // 화면 찌릿하는 글리치/쉐이크 연출
                if (typeof gsap !== "undefined") {
                    gsap.fromTo("#hero-hip", 
                        { x: -4 }, 
                        { x: 0, duration: 0.04, repeat: 5, yoyo: true }
                    );
                }
            } else {
                // INACTIVE 상태
                if (btnStatusText) btnStatusText.innerText = "SYSTEM : OFF";
                if (btnTitleText) btnTitleText.innerHTML = "개발자 모드<br>ACTIVATE ↗";
            }
        });
    }

    // ==========================================
    // 4. REVIEWS 섹션 마우스 모멘텀 드래그 스크롤 구현
    // ==========================================
    const slider = document.querySelector('.review-track-wrapper');
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let cancelId = null;
    let lastEventTime = 0;
    let lastEventX = 0;

    if (slider) {
        const momentumLoop = () => {
            slider.scrollLeft += velocity;
            velocity *= 0.93; // 관성 마찰 계수
            
            if (Math.abs(velocity) > 0.5) {
                cancelId = requestAnimationFrame(momentumLoop);
            }
        };

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            velocity = 0;
            cancelAnimationFrame(cancelId);
            
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            
            lastEventTime = Date.now();
            lastEventX = e.pageX;
        });

        slider.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            momentumLoop();
        });

        slider.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            momentumLoop();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.3; // 드래그 감도
            slider.scrollLeft = scrollLeft - walk;

            const now = Date.now();
            const elapsed = now - lastEventTime;
            if (elapsed > 0) {
                const deltaX = e.pageX - lastEventX;
                velocity = -(deltaX / elapsed) * 12;
                lastEventTime = now;
                lastEventX = e.pageX;
            }
        });
    }

    // ==========================================
    // 5. 섹션별 유기적인 배경색(테마) 체인징 활성화
    // ==========================================
    const sections = document.querySelectorAll('section, footer, .bento-section, .hip-works-section, .hip-reviews-section');

    if (typeof ScrollTrigger !== "undefined" && sections.length > 0) {
        sections.forEach((section) => {
            const theme = section.getAttribute('data-theme');
            if (!theme) return; // 테마 지정 안 된 섹션 스킵
            
            ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => updateTheme(theme),
                onEnterBack: () => updateTheme(theme),
            });
        });
    }

    function updateTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            if (follower && typeof gsap !== "undefined") {
                gsap.to(follower, { borderColor: "#ffffff", duration: 0.3 });
            }
        } else {
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
            if (follower && typeof gsap !== "undefined") {
                gsap.to(follower, { borderColor: "#000000", duration: 0.3 });
            }
        }
    }

});