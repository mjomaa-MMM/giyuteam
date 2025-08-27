import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.about": "About Us",
      "nav.sensei": "Sensei",
      "nav.classes": "Classes",
      "nav.payment": "Payment",
      "nav.contact": "Contact",
      "nav.register": "Register Now",
      
      // Hero Section
      "hero.title": "Giyu Team By Jomaa",
      "hero.subtitle": "Master the Art of Kyokushin Karate",
      "hero.description": "Experience authentic Kyokushin Karate training under the guidance of Sensei Mohammad Jomaa (1st Dan Black Belt). Build strength, discipline, and character through traditional martial arts.",
      "hero.viewClasses": "View Classes",
      "hero.blackBelt": "1st Dan Black Belt",
      "hero.allAges": "All Ages Welcome",
      
      // About Section
      "about.title": "About Giyu Team By Jomaa",
      "about.subtitle": "Excellence in Kyokushin Karate Training",
      "about.mission": "At Giyu Team By Jomaa, we are dedicated to preserving and teaching the authentic spirit of Kyokushin Karate. Our dojo, located in the heart of Houmin al Fawka, Nabatiyeh, provides a supportive environment where students of all ages can develop physical strength, mental discipline, and strong character.",
      "about.classes": "We offer both private sessions for personalized instruction and group classes that foster camaraderie and team spirit. Our training emphasizes the traditional values of respect, perseverance, and continuous self-improvement.",
      "about.location": "Join us at our dojo in Houmin al Fawka, Nabatiyeh, Lebanon, and begin your journey in the powerful and transformative art of Kyokushin Karate.",
      "about.respect": "Respect & Honor",
      "about.respectDesc": "Building character through traditional martial arts values",
      "about.discipline": "Discipline & Focus",
      "about.disciplineDesc": "Developing mental strength and concentration",
      "about.community": "Community Spirit",
      "about.communityDesc": "Creating lasting bonds through shared training",
      "about.excellence": "Pursuit of Excellence",
      "about.excellenceDesc": "Continuous improvement in technique and character",
      
      // Sensei Section
      "sensei.title": "Meet Your Sensei",
      "sensei.name": "Sensei Mohammad Jomaa",
      "sensei.rank": "1st Dan Black Belt",
      "sensei.description": "With years of dedicated training and a deep understanding of Kyokushin principles, Sensei Mohammad Jomaa brings passion and expertise to every class. His teaching philosophy emphasizes not just physical technique, but the development of character, discipline, and respect that are fundamental to martial arts.",
      "sensei.guidance": "Expert Guidance",
      "sensei.allAgesTeaching": "All Ages",
      
      // Classes Section
      "classes.title": "Training Programs",
      "classes.subtitle": "Choose Your Path to Mastery",
      "classes.private.title": "Private Training Sessions",
      "classes.private.description": "One-on-one instruction tailored to your specific goals and skill level. Perfect for beginners or advanced students seeking personalized attention.",
      "classes.private.personalized": "Personalized curriculum",
      "classes.private.flexible": "Flexible scheduling",
      "classes.private.focused": "Focused attention",
      "classes.private.rapid": "Rapid progression",
      "classes.private.book": "Book Private Session",
      "classes.group.title": "Group Classes",
      "classes.group.subtitle": "Train with fellow martial artists",
      "classes.group.register": "Register for Group Classes",
      "classes.group.kids": "Kids (6-12 years)",
      "classes.group.teens": "Teens (13-17 years)",
      "classes.group.adults": "Adults (18+ years)",
      
      // Payment Section
      "payment.title": "Payment Options",
      "payment.subtitle": "Easy and Secure Payment Methods",
      "payment.instructions": "Payment Instructions",
      "payment.whishMoney": "We accept payments through Whish Money for your convenience:",
      "payment.step1": "Download the Whish Money app from your app store",
      "payment.step2": "Send payment to: +961 76 123 456",
      "payment.step3": "Include your name and class type in the payment notes",
      "payment.step4": "Take a screenshot of the payment confirmation",
      "payment.step5": "Send the screenshot using the form below",
      "payment.notification": "Payment Notification",
      "payment.form.description": "Please fill out this form after making your payment to notify us:",
      "payment.form.name": "Full Name",
      "payment.form.namePlaceholder": "Enter your full name",
      "payment.form.phone": "Phone Number",
      "payment.form.phonePlaceholder": "Enter your phone number",
      "payment.form.amount": "Payment Amount (USD)",
      "payment.form.amountPlaceholder": "Enter payment amount",
      "payment.form.type": "Class Type",
      "payment.form.typePlaceholder": "Select class type",
      "payment.form.private": "Private Session",
      "payment.form.group": "Group Class",
      "payment.form.notes": "Additional Notes",
      "payment.form.notesPlaceholder": "Any additional information",
      "payment.form.submit": "Send Payment Notification",
      
      // Contact Section
      "contact.title": "Contact Us",
      "contact.subtitle": "Get in Touch",
      "contact.info": "Contact Information",
      "contact.location": "Houmin al Fawka, Nabatiyeh, Lebanon",
      "contact.hours": "Training Hours",
      "contact.form.title": "Send us a Message",
      "contact.form.name": "Name",
      "contact.form.email": "Email",
      "contact.form.message": "Message",
      "contact.form.send": "Send Message",
      
      // Footer
      "footer.dojo": "Giyu Team By Jomaa",
      "footer.description": "Authentic Kyokushin Karate training in Houmin al Fawka, Nabatiyeh. Building strength, character, and discipline through traditional martial arts.",
      "footer.quickLinks": "Quick Links",
      "footer.aboutSensei": "About Sensei",
      "footer.contactInfo": "Contact Info",
      "footer.followUs": "Follow Us",
      "footer.copyright": "© 2024 Giyu Team By Jomaa. All rights reserved.",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "An error occurred",
      "common.success": "Success!"
    }
  },
  ar: {
    translation: {
      // Navigation
      "nav.home": "الرئيسية",
      "nav.about": "من نحن",
      "nav.sensei": "السنسي",
      "nav.classes": "الصفوف",
      "nav.payment": "الدفع",
      "nav.contact": "اتصل بنا",
      "nav.register": "سجل الآن",
      
      // Hero Section
      "hero.title": "فريق جيو بقيادة جمعة",
      "hero.subtitle": "أتقن فن الكيوكوشين كاراتيه",
      "hero.description": "اختبر التدريب الأصيل للكيوكوشين كاراتيه تحت إشراف السنسي محمد جمعة (الحزام الأسود الدرجة الأولى). اكتسب القوة والانضباط والشخصية من خلال الفنون القتالية التقليدية.",
      "hero.viewClasses": "عرض الصفوف",
      "hero.blackBelt": "حزام أسود درجة أولى",
      "hero.allAges": "جميع الأعمار مرحب بها",
      
      // About Section
      "about.title": "حول فريق جيو بقيادة جمعة",
      "about.subtitle": "التميز في تدريب الكيوكوشين كاراتيه",
      "about.mission": "في فريق جيو بقيادة جمعة، نحن مكرسون للحفاظ على روح الكيوكوشين كاراتيه الأصيلة وتعليمها. دوجونا، الواقع في قلب حومين الفوقا، النبطية، يوفر بيئة داعمة حيث يمكن للطلاب من جميع الأعمار تطوير القوة الجسدية والانضباط العقلي والشخصية القوية.",
      "about.classes": "نحن نقدم جلسات خاصة للتدريب الشخصي وصفوف جماعية تعزز الصداقة وروح الفريق. يركز تدريبنا على القيم التقليدية للاحترام والمثابرة والتحسن المستمر للذات.",
      "about.location": "انضم إلينا في دوجونا في حومين الفوقا، النبطية، لبنان، وابدأ رحلتك في فن الكيوكوشين كاراتيه القوي والتحويلي.",
      "about.respect": "الاحترام والشرف",
      "about.respectDesc": "بناء الشخصية من خلال قيم الفنون القتالية التقليدية",
      "about.discipline": "الانضباط والتركيز",
      "about.disciplineDesc": "تطوير القوة العقلية والتركيز",
      "about.community": "روح المجتمع",
      "about.communityDesc": "إنشاء روابط دائمة من خلال التدريب المشترك",
      "about.excellence": "السعي للتميز",
      "about.excellenceDesc": "التحسن المستمر في التقنية والشخصية",
      
      // Sensei Section
      "sensei.title": "تعرف على سنسيك",
      "sensei.name": "السنسي محمد جمعة",
      "sensei.rank": "حزام أسود درجة أولى",
      "sensei.description": "بسنوات من التدريب المكرس والفهم العميق لمبادئ الكيوكوشين، يجلب السنسي محمد جمعة الشغف والخبرة إلى كل صف. تؤكد فلسفته التعليمية ليس فقط على التقنية الجسدية، ولكن على تطوير الشخصية والانضباط والاحترام التي هي أساسية للفنون القتالية.",
      "sensei.guidance": "إرشاد خبير",
      "sensei.allAgesTeaching": "جميع الأعمار",
      
      // Classes Section
      "classes.title": "برامج التدريب",
      "classes.subtitle": "اختر طريقك للإتقان",
      "classes.private.title": "جلسات التدريب الخاصة",
      "classes.private.description": "تدريب فردي مصمم خصيصاً لأهدافك ومستوى مهارتك. مثالي للمبتدئين أو الطلاب المتقدمين الذين يسعون للحصول على اهتمام شخصي.",
      "classes.private.personalized": "منهج شخصي",
      "classes.private.flexible": "جدولة مرنة",
      "classes.private.focused": "اهتمام مركز",
      "classes.private.rapid": "تقدم سريع",
      "classes.private.book": "احجز جلسة خاصة",
      "classes.group.title": "الصفوف الجماعية",
      "classes.group.subtitle": "تدرب مع زملاء فنانين قتاليين",
      "classes.group.register": "سجل للصفوف الجماعية",
      "classes.group.kids": "الأطفال (6-12 سنة)",
      "classes.group.teens": "المراهقون (13-17 سنة)",
      "classes.group.adults": "البالغون (18+ سنة)",
      
      // Payment Section
      "payment.title": "خيارات الدفع",
      "payment.subtitle": "طرق دفع سهلة وآمنة",
      "payment.instructions": "تعليمات الدفع",
      "payment.whishMoney": "نحن نقبل المدفوعات من خلال ويش موني لراحتك:",
      "payment.step1": "قم بتحميل تطبيق ويش موني من متجر التطبيقات",
      "payment.step2": "أرسل الدفعة إلى: +961 76 123 456",
      "payment.step3": "اكتب اسمك ونوع الصف في ملاحظات الدفع",
      "payment.step4": "التقط لقطة شاشة لتأكيد الدفع",
      "payment.step5": "أرسل لقطة الشاشة باستخدام النموذج أدناه",
      "payment.notification": "إشعار الدفع",
      "payment.form.description": "يرجى ملء هذا النموذج بعد إجراء الدفع لإعلامنا:",
      "payment.form.name": "الاسم الكامل",
      "payment.form.namePlaceholder": "أدخل اسمك الكامل",
      "payment.form.phone": "رقم الهاتف",
      "payment.form.phonePlaceholder": "أدخل رقم هاتفك",
      "payment.form.amount": "مبلغ الدفع (دولار أمريكي)",
      "payment.form.amountPlaceholder": "أدخل مبلغ الدفع",
      "payment.form.type": "نوع الصف",
      "payment.form.typePlaceholder": "اختر نوع الصف",
      "payment.form.private": "جلسة خاصة",
      "payment.form.group": "صف جماعي",
      "payment.form.notes": "ملاحظات إضافية",
      "payment.form.notesPlaceholder": "أي معلومات إضافية",
      "payment.form.submit": "أرسل إشعار الدفع",
      
      // Contact Section
      "contact.title": "اتصل بنا",
      "contact.subtitle": "ابق على تواصل",
      "contact.info": "معلومات الاتصال",
      "contact.location": "حومين الفوقا، النبطية، لبنان",
      "contact.hours": "ساعات التدريب",
      "contact.form.title": "أرسل لنا رسالة",
      "contact.form.name": "الاسم",
      "contact.form.email": "البريد الإلكتروني",
      "contact.form.message": "الرسالة",
      "contact.form.send": "أرسل الرسالة",
      
      // Footer
      "footer.dojo": "فريق جيو بقيادة جمعة",
      "footer.description": "تدريب أصيل للكيوكوشين كاراتيه في حومين الفوقا، النبطية. بناء القوة والشخصية والانضباط من خلال الفنون القتالية التقليدية.",
      "footer.quickLinks": "روابط سريعة",
      "footer.aboutSensei": "حول السنسي",
      "footer.contactInfo": "معلومات الاتصال",
      "footer.followUs": "تابعنا",
      "footer.copyright": "© 2024 فريق جيو بقيادة جمعة. جميع الحقوق محفوظة.",
      
      // Common
      "common.loading": "جاري التحميل...",
      "common.error": "حدث خطأ",
      "common.success": "نجح!"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;