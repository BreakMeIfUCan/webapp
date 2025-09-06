# 🧪 Testing Guide for NLP Attack Platform

## 🚀 Quick Start Testing

### 1. **Start the Application**
```bash
npm run dev
```
Your app will be available at `http://localhost:3000`

### 2. **Test the Python Backend (Optional)**
```bash
# In a separate terminal
python python_backend_example.py
```
This will start the Python backend at `http://localhost:8000`

---

## 📋 Complete Testing Checklist

### **Phase 1: Basic Navigation & Authentication**

#### ✅ **Homepage Testing**
1. **Visit** `http://localhost:3000`
2. **Check** if the page loads without errors
3. **Verify** theme toggle works (light/dark mode)
4. **Test** navigation links in the navbar

#### ✅ **Authentication Flow**
1. **Sign Up** - Create a new account
   - Go to `/auth/signup`
   - Fill out the form
   - Check if user is created in database
2. **Login** - Sign in with your account
   - Go to `/auth/login`
   - Use your credentials
   - Verify redirect to dashboard

#### ✅ **Dashboard Access**
1. **Navigate** to `/dashboard`
2. **Verify** sidebar navigation works
3. **Check** if dashboard loads with real data (should be empty initially)

---

### **Phase 2: Test Creation & Management**

#### ✅ **Create White Box Test**
1. **Go to** `/dashboard/create`
2. **Select** "White Box" category
3. **Fill out** the form:
   - Name: "BERT Security Test"
   - Description: "Testing BERT model security"
   - Model ID: "bert-base-uncased"
   - Upload a CSV file (optional)
4. **Submit** the form
5. **Verify** test appears in dashboard

#### ✅ **Create Black Box Test**
1. **Go to** `/dashboard/create`
2. **Select** "Black Box" category
3. **Fill out** the form:
   - Name: "GPT-2 Phishing Attack"
   - Description: "Testing phishing attacks"
   - Attack Category: "Phishing"
   - cURL Endpoint: `curl -X POST https://api.openai.com/v1/chat/completions -H "Authorization: Bearer YOUR_KEY" -H "Content-Type: application/json" -d '{"model": "gpt-2", "messages": [{"role": "user", "content": "Hello"}]}'`
4. **Submit** the form
5. **Verify** test appears in dashboard

---

### **Phase 3: Test Results & Monitoring**

#### ✅ **View Test Results**
1. **Go to** `/dashboard/results`
2. **Verify** your created tests appear
3. **Check** test status (should be "pending" initially)
4. **Click** on individual tests to view details

#### ✅ **Individual Test View**
1. **Click** on a test from the results page
2. **Verify** detailed test information loads
3. **Check** if all test parameters are displayed correctly

---

### **Phase 4: Backend Integration Testing**

#### ✅ **Python Backend Integration**
1. **Start** the Python backend: `python python_backend_example.py`
2. **Create** a new test through the UI
3. **Check** Python backend logs for test submission
4. **Verify** webhook updates work (test status changes)

#### ✅ **Webhook Testing**
1. **Monitor** the webhook endpoint: `/api/webhooks/test-update`
2. **Check** if Python backend can update test status
3. **Verify** database updates reflect in the UI

---

## 🔍 **What to Look For**

### **✅ Success Indicators**
- ✅ No console errors in browser
- ✅ Database queries execute successfully
- ✅ Forms submit without errors
- ✅ Navigation works smoothly
- ✅ Real-time updates (if Python backend is running)
- ✅ Proper error handling and loading states

### **❌ Common Issues to Check**
- ❌ Database connection errors
- ❌ Authentication failures
- ❌ Form validation errors
- ❌ Missing environment variables
- ❌ Python backend connection issues

---

## 🛠️ **Debugging Tools**

### **Database Inspection**
```bash
# Open Drizzle Studio to view database
npm run db:studio
```

### **Check Logs**
- **Browser Console**: Check for JavaScript errors
- **Terminal**: Check Next.js server logs
- **Python Backend**: Check backend logs for test processing

### **Environment Variables**
Make sure these are set in your `.env` file:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
PYTHON_BACKEND_URL="http://localhost:8000"
```

---

## 📊 **Test Data Examples**

### **White Box Test Data**
```json
{
  "name": "BERT Security Analysis",
  "description": "Comprehensive security testing of BERT model",
  "category": "white",
  "modelId": "bert-base-uncased",
  "customDatasetPath": "security_test_dataset.csv"
}
```

### **Black Box Test Data**
```json
{
  "name": "GPT-2 Phishing Attack",
  "description": "Testing phishing attack vectors",
  "category": "black",
  "attackCategory": "Phishing",
  "curlEndpoint": "curl -X POST https://api.example.com/v1/chat/completions..."
}
```

---

## 🎯 **Expected Results**

### **After Creating Tests**
- Tests should appear in `/dashboard/results`
- Status should be "pending" initially
- All form data should be saved correctly

### **With Python Backend Running**
- Tests should be submitted to Python backend
- Status should update to "running" then "completed"
- Results should populate with mock data

### **Database Verification**
- Users table should have your account
- Tests table should have your created tests
- All fields should be populated correctly

---

## 🚨 **Troubleshooting**

### **Database Connection Issues**
```bash
# Check if database is accessible
npm run db:studio
```

### **Authentication Issues**
- Verify Supabase configuration
- Check if user is created in database
- Ensure proper redirects after login

### **Form Submission Issues**
- Check browser console for errors
- Verify server actions are working
- Check database for inserted records

---

## 📝 **Testing Notes**

Keep track of:
- [ ] Which tests you created
- [ ] Any errors encountered
- [ ] Performance observations
- [ ] UI/UX feedback
- [ ] Backend integration status

---

**Happy Testing! 🎉**

If you encounter any issues, check the console logs and database to identify the problem.
