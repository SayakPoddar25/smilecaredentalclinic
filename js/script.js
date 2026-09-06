document.addEventListener('DOMContentLoaded', () => {
    
    // ১. ডেটা ফাইল ঠিকমতো লিংক করা আছে কিনা চেক করা
    if (typeof clinicData === 'undefined') {
        console.error("data.js load হয়নি!");
        alert("দয়া করে HTML ফাইলের নিচে <script src='data.js'></script> লাইনটি আছে কিনা চেক করুন।");
        return;
    }

    // ২. কোনো এরর ছাড়া সেফভাবে টেক্সট বসানোর ফাংশন
    const safeSetText = (id, text) => {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    };

    safeSetText('nav-clinic-name', clinicData.clinicName);
    safeSetText('brand-name', clinicData.clinicName);
    safeSetText('nav-doctor-name', clinicData.doctor.name);
    safeSetText('brand-doctor', clinicData.doctor.name);
    safeSetText('hero-sub', clinicData.subTitle + " | " + clinicData.doctor.speciality);
    safeSetText('hero-desc', clinicData.subTitle + " | " + clinicData.doctor.speciality);
    safeSetText('about-doc', clinicData.doctor.name);
    safeSetText('about-doctor-name', clinicData.doctor.name);
    safeSetText('about-deg', clinicData.doctor.degrees);
    safeSetText('about-degree', clinicData.doctor.degrees);

    // ৩. সার্ভিসেস (সেফটি চেক অ্যাড করা হলো যাতে স্ক্রিপ্ট ক্র্যাশ না করে)
    const srvContainer = document.getElementById('services-container');
    if (srvContainer && clinicData.services) {
        srvContainer.innerHTML = ''; 
        srvContainer.style.display = "grid";
        srvContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
        srvContainer.style.gap = "20px";
        srvContainer.style.padding = "20px";

        clinicData.services.forEach((srv, index) => {
            let div = document.createElement('div');
            div.id = `service-card-${index + 1}`;
            div.className = "service-card"; 
            div.style.cssText = "padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 8px; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.05);";
            
            div.innerHTML = `
                <img id="thumb-${index + 1}" src="${srv.image || 'your-image-link.jpg'}" alt="${srv.title}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;"> 
                <h3 id="title-${index + 1}" style="margin-bottom: 10px; color: #0047AB; font-size: 1.2rem;">${srv.title}</h3> 
                <p id="desc-${index + 1}" style="color: #333333; font-size: 0.95rem; margin-bottom: 15px; font-weight: 500;">${srv.desc}</p>
                <p id="doc-${index + 1}" style="color: #000000; font-size: 0.95rem; font-weight: bold; border-top: 1px solid #eee; padding-top: 10px; margin: 0;">Dr. ${clinicData.doctor.name}</p>
            `;
            srvContainer.appendChild(div);
        });
    }

    // ৪. FAQ ইনজেক্ট করা
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer && clinicData.faqs) {
        faqContainer.innerHTML = '';
        clinicData.faqs.forEach(faq => {
            let div = document.createElement('div');
            div.style.cssText = "background: #fff; border: 1px solid #ddd; margin-bottom: 10px; padding: 15px; border-radius: 5px; text-align: left;";
            div.innerHTML = `<div style="font-weight: bold; color: #0047AB; margin-bottom: 5px;"><i class="fas fa-question-circle"></i> ${faq.q}</div> <div style="color: #555;">${faq.a}</div>`;
            faqContainer.appendChild(div);
        });
    }

    // ৫. চেম্বার ইনফো এবং ড্রপডাউন (ডবল ইভেন্ট লিসেনার সরানো হলো)
    const dropdown = document.getElementById('form-chamber-select');
    const infoContainer = document.getElementById('chambers-container');
    
    if (clinicData.chambers) {
        // লোকেশন কার্ডগুলো তৈরি করা
        if (infoContainer) {
            infoContainer.innerHTML = '';
            clinicData.chambers.forEach(chamber => {
                let info = document.createElement('div');
                info.style.cssText = "margin-bottom: 20px; padding: 15px; border-left: 4px solid #0047AB; background: #f8fafc; text-align: left; border-radius: 0 8px 8px 0;";
                info.innerHTML = `
                    <h4 style="color: #0047AB; font-size: 1.2rem; margin-bottom: 8px;">${chamber.name}</h4>
                    <p style="color: #333; margin-bottom: 5px; font-size: 0.95rem;"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>${chamber.address}</p>
                    <p style="color: #333; margin: 0; font-size: 0.95rem;"><i class="far fa-clock" style="margin-right: 5px;"></i>${chamber.time}</p>
                `;
                infoContainer.appendChild(info);
            });
        }

        // ফর্মের ড্রপডাউন ডাইনামিক করা
        if (dropdown) {
            dropdown.innerHTML = '<option value="" disabled selected>Choose Clinic Location...</option>';
            clinicData.chambers.forEach(ch => {
                let opt = document.createElement('option');
                opt.value = ch.name; 
                opt.textContent = ch.name; 
                dropdown.appendChild(opt);
            });
        }
    }

    // ৬. ফর্ম সাবমিশন (WhatsApp Template)
    const form = document.getElementById('appointmentForm');
    const msg = document.getElementById('form-message');
    const btn = document.getElementById('submitBtn');
    
    // আপনার হোয়াটসঅ্যাপ নাম্বার (কান্ট্রি কোড ৯১ সহ)
    const whatsappNumber = "919647454839"; 

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            
            // ফর্ম থেকে ডেটা নেওয়া
            let formData = new FormData(form);
            let name = formData.get('name');
            let phone = formData.get('phone');
            let date = formData.get('date');
            let time = formData.get('time');
            let chamber = formData.get('chamber');
            
            // সুন্দর ও গোছানো টেমপ্লেট তৈরি
            let message = `📅 *New Appointment Request* 📅\n` +
                          `----------------------------------------------\n` +
                          `👤 *Patient Name:* ${name}\n` +
                          `📞 *Phone No:* ${phone}\n` +
                          `🗓️ *Booking Date:* ${date}\n` +
                          `⏰ *Booking Time:* ${time}\n` +
                          `🏥 *Selected Clinic:* ${chamber}\n` +
                          `----------------------------------------------\n` +
                          `🦷 *Smile Care Dental Clinic*`;
            
            // মেসেজটিকে লিংকের জন্য রেডি করা
            let encodedMessage = encodeURIComponent(message);
            
            // হোয়াটসঅ্যাপের লিংক তৈরি করা
            let waLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // নতুন ট্যাবে হোয়াটসঅ্যাপ ওপেন করা
            window.open(waLink, '_blank');
            
            // ওয়েবসাইটে সাকসেস মেসেজ দেখানো
            if(msg) { 
                msg.style.color = "green"; 
                msg.textContent = "Redirecting to WhatsApp..."; 
            }
            form.reset();
        });
    }
});