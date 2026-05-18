document.addEventListener("DOMContentLoaded", function () {
    
    gsap.registerPlugin(ScrollTrigger);

    // 1. 커스텀 마우스 무브 로직 보완
    const cursor = document.querySelector(".hip-cursor");
    const follower = document.querySelector(".hip-cursor-follower");

    if(cursor && follower) {
        document.addEventListener("mousemove", (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.15 });
        });

        // 카드, 링크, 새로 만든 버튼 호버 시 동그라미 반전 및 확대 연동
        document.querySelectorAll(".bento-card, .hip-work-row, .r-card, .w-single-btn, .h-nav a, .h-logo").forEach((elem) => {
            elem.addEventListener("mouseenter", () => {
                gsap.to(follower, { scale: 1.6, backgroundColor: "rgba(26, 156, 0, 0.1)", borderColor: "#1A9C00", duration: 0.3 });
            });
            elem.addEventListener("mouseleave", () => {
                const isLight = document.body.classList.contains("theme-light");
                gsap.to(follower, { scale: 1, backgroundColor: "transparent", borderColor: isLight ? "#000000" : "#ffffff", duration: 0.3 });
            });
        });
    }

    // 2. HERO 애니메이션 타겟 매핑 오류 수정 완료
    gsap.from(".hero-title", { 
        y: 60, 
        opacity: 0, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: "power4.out" 
    });
    gsap.from(".hero-welcome-wrap", { 
        x: -30, 
        opacity: 0, 
        duration: 1, 
        delay: 0.6, 
        ease: "power3.out" 
    });

    // 3. BENTO GRID 등장 애니메이션
    if(document.querySelector(".bento-grid")) {
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

    // 4. REVIEWS 섹션 마우스 모멘텀 드래그 스크롤 구현
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
            velocity *= 0.93; // 관성 마찰 계수 조정
            
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
            const walk = (x - startX) * 1.3; // 드래그 감도 소폭 상향
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

    // 5. 섹션별 유기적인 배경색(테마) 체인징 활성화
    const sections = document.querySelectorAll('section, footer');

    sections.forEach((section) => {
        const theme = section.getAttribute('data-theme');
        if(!theme) return; // 테마 지정 안 된 섹션 스킵
        
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => updateTheme(theme),
            onEnterBack: () => updateTheme(theme),
        });
    });

    function updateTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            gsap.to(follower, {borderColor: "#ffffff", duration: 0.3});
        } else {
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
            gsap.to(follower, {borderColor: "#000000", duration: 0.3});
        }
    }

    // ==========================================
    // HERO SECTION - BIG WIDGET INSPECT TOGGLE
    // ==========================================
    const inspectBtn = document.getElementById("inspect-trigger-btn");
    const btnStatusText = document.querySelector(".btn-status");
    const btnTitleText = document.querySelector(".btn-title");

    if (inspectBtn) {
        inspectBtn.addEventListener("click", function () {
            // body에 클래스 토글
            const isInspectActive = document.body.classList.toggle("is-inspect");
            
            if (isInspectActive) {
                // ON 상태 일 때 
                if(btnStatusText) btnStatusText.innerText = "SYSTEM : ON (ACTIVE)";
                if(btnTitleText) btnTitleText.innerHTML = "개발자 모드<br>DEACTIVATE ↩";
                
                // 찌릿하는 화면 쉐이크 연출
                gsap.fromTo("#hero-hip", 
                    { x: -3 }, 
                    { x: 0, duration: 0.04, repeat: 4, yoyo: true }
                );
            } else {
                // OFF 상태 일 때
                if(btnStatusText) btnStatusText.innerText = "SYSTEM : OFF";
                if(btnTitleText) btnTitleText.innerHTML = "개발자 모드<br>ACTIVATE ↗";
            }
        });

        // 커스텀 마우스 커서 호버 효과 그룹에 이 버튼도 포함
        inspectBtn.addEventListener("mouseenter", () => {
            const follower = document.querySelector(".hip-cursor-follower");
            if(follower) gsap.to(follower, { scale: 1.4, backgroundColor: "rgba(26, 156, 0, 0.1)", borderColor: "#1A9C00" });
        });
        inspectBtn.addEventListener("mouseleave", () => {
            const follower = document.querySelector(".hip-cursor-follower");
            if(follower) gsap.to(follower, { scale: 1, backgroundColor: "transparent", borderColor: "#ffffff" });
        });
    }

});
