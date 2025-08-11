# ImgBB API Setup Guide

## ছবি আপলোড করার জন্য ImgBB API কী সেটআপ করুন

### 1. ImgBB API কী নিন
- https://api.imgbb.com/ এ যান
- Sign up করুন (ফ্রি)
- API key কপি করুন

### 2. Environment Variable সেট করুন
প্রজেক্টের রুটে `.env` ফাইল তৈরি করুন:

```env
VITE_IMGBB_API_KEY=your_actual_api_key_here
```

### 3. সার্ভার রিস্টার্ট করুন
```bash
npm run dev
```

### 4. টেস্ট করুন
- নতুন রিপোর্ট যোগ করুন
- ছবি আপলোড করুন
- Console এ ImgBB response দেখুন

### সমস্যা সমাধান:
- **ছবি কালো দেখাচ্ছে**: ImgBB API key সঠিকভাবে সেট করা নেই
- **API key not found**: `.env` ফাইল তৈরি করুন এবং API key যোগ করুন
- **Upload failed**: API key সঠিক কিনা চেক করুন

### নোট:
- ImgBB ফ্রি প্ল্যানে প্রতি মাসে 1000 ছবি আপলোড করতে পারবেন
- ছবি সর্বোচ্চ 32MB পর্যন্ত হতে পারে
- API key কখনও public repository তে push করবেন না
