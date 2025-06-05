    const data = [];
    const list = document.getElementById("list");
    const ctx = document.getElementById("wheel").getContext("2d");
    const result = document.getElementById("result");

    document.getElementById("add").onclick = () => {
      const label = document.getElementById("label").value.trim();
      const color = document.getElementById("color").value;
      if (!label) return alert("項目を入力してください。");

      data.push({ label, color });
      renderList();
    };

    function renderList() {
      list.innerHTML = "";
      data.forEach((item, i) => {
        const row = document.createElement("div");
        row.className = "entry-row";
        row.innerHTML = `
          <input type="text" value="${item.label}" disabled>
          <div style="width:20px; height:20px; background:${item.color}; border:1px solid #333;"></div>
          <button class="remove">X</button>
        `;
        row.querySelector(".remove").onclick = () => {
          data.splice(i, 1);
          renderList();
        };
        list.appendChild(row);
      });
    }

    document.getElementById("spinBtn").onclick = () => {
      if (data.length === 0) {
        alert("項目を追加してください。");
        return;
      }
      drawWheel();
      spin();
    };

    function drawWheel(rotation = 0) {
      const total = data.length;
      const angle = (Math.PI * 2) / total;

      ctx.clearRect(0, 0, 400, 400);
      for (let i = 0; i < total; i++) {
        const start = rotation + angle * i;
        const end = start + angle;
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, start, end);
        ctx.fillStyle = data[i].color;
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(start + angle / 2);
        ctx.fillStyle = "#000";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(data[i].label, 180, 5);
        ctx.restore();
      }
    }

    function spin() {
      let rotation = 0;
      let speed = Math.random() * 0.3 + 0.25;
      const friction = 0.985;

      function animate() {
        speed *= friction;
        rotation += speed;

        drawWheel(rotation);

        if (speed > 0.005) {
          requestAnimationFrame(animate);
        } else {
          // 🎯 正確な当たり判定（針が上を向いている）
          const degrees = (rotation * 180 / Math.PI) % 360;
          const normalized = (360 - degrees + 270) % 360; // ← ここが重要！
          const slice = 360 / data.length;
          const index = Math.floor(normalized / slice) % data.length;
          result.textContent = `🎉 当たり: ${data[index].label} 🎉`;
        }
      }

      animate();
    }