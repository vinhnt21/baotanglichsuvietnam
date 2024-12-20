document.addEventListener("DOMContentLoaded", function () {
    const feedbackForm = document.querySelector(".feedback-form");
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVxDmzj4oDt57m16ZaD7HHAB8sRBlZ-aYJR8G-ztzC0Y7B2c_b1GhOiNui73eNGkAD/exec';

    feedbackForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: this.querySelector('input[placeholder="Họ và tên"]').value,
            email: this.querySelector('input[placeholder="Email"]').value,
            phone: this.querySelector('input[placeholder="Số điện thoại"]').value,
            subject: this.querySelector('input[placeholder="Chủ đề"]').value,
            feedback: this.querySelector('textarea').value
        };

        try {
            // Get submit button
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML; // Lưu lại HTML gốc bao gồm cả icon
            submitButton.innerHTML = 'Đang gửi...';
            submitButton.disabled = true;

            // Send data to Google Apps Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(formData)
            });

            // Show success message
            document.getElementById("feedback-subtitle").innerText =
                "Cảm ơn bạn đã gửi phản hồi!";

            // Reset form
            this.reset();

            // Reset message after 3 seconds
            setTimeout(() => {
                document.getElementById("feedback-subtitle").innerText =
                    "Chúng tôi trân trọng ý kiến đóng góp và đề xuất của bạn để cải thiện nội dung và trải nghiệm người dùng!";
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại!');
        } finally {
            // Reset button state với HTML gốc bao gồm cả icon
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi phản hồi';
            submitButton.disabled = false;
        }
    });
});