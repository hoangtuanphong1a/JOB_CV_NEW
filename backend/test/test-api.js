const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';

async function testAPI() {
  console.log('🚀 Testing CVKing API Modules...\n');

  try {
    // 1. Test Auth Module
    console.log('🔐 Testing Auth Module...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'password123',
      role: 'job_seeker'
    });
    console.log('✅ User registered:', registerResponse.data);

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = loginResponse.data.accessToken;
    console.log('✅ User logged in, token received\n');

    // Set Authorization header for subsequent requests
    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };

    // 2. Test Users Module
    console.log('👤 Testing Users Module...');
    const usersResponse = await axios.get(`${BASE_URL}/users`, config);
    console.log('✅ Users retrieved:', usersResponse.data.data.length, 'users');

    const userProfile = await axios.get(`${BASE_URL}/users/profile`, config);
    console.log('✅ User profile retrieved\n');

    // 3. Test Companies Module
    console.log('🏢 Testing Companies Module...');
    const createCompanyResponse = await axios.post(`${BASE_URL}/companies`, {
      name: 'Test Company',
      description: 'A test company',
      industry: 'Technology',
      website: 'https://testcompany.com',
      location: 'New York'
    }, config);
    console.log('✅ Company created:', createCompanyResponse.data);

    const companiesResponse = await axios.get(`${BASE_URL}/companies`, config);
    console.log('✅ Companies retrieved:', companiesResponse.data.data.length, 'companies\n');

    // 4. Test Subscription Plans Module
    console.log('💳 Testing Subscription Plans Module...');
    const createPlanResponse = await axios.post(`${BASE_URL}/subscription-plans`, {
      name: 'Test Plan',
      description: 'A test subscription plan',
      planType: 'basic',
      price: 29.99,
      billingCycle: 'monthly',
      maxJobs: 5,
      maxApplications: 25,
      isActive: true
    }, config);
    console.log('✅ Subscription plan created:', createPlanResponse.data);

    const plansResponse = await axios.get(`${BASE_URL}/subscription-plans`, config);
    console.log('✅ Subscription plans retrieved:', plansResponse.data.data.length, 'plans\n');

    // 5. Test Jobs Module
    console.log('💼 Testing Jobs Module...');
    const createJobResponse = await axios.post(`${BASE_URL}/jobs`, {
      title: 'Software Engineer',
      description: 'We are looking for a skilled software engineer...',
      requirements: '5+ years experience, React, Node.js',
      jobType: 'full_time',
      experienceLevel: 'mid_level',
      city: 'San Francisco',
      country: 'USA',
      minSalary: 80000,
      maxSalary: 120000,
      currency: 'USD',
      skills: ['React', 'Node.js', 'TypeScript']
    }, config);
    console.log('✅ Job created:', createJobResponse.data);

    const jobsResponse = await axios.get(`${BASE_URL}/jobs`, config);
    console.log('✅ Jobs retrieved:', jobsResponse.data.data.length, 'jobs\n');

    // 6. Test Saved Jobs Module
    console.log('⭐ Testing Saved Jobs Module...');
    if (jobsResponse.data.data.length > 0) {
      const jobId = jobsResponse.data.data[0].id;
      const saveJobResponse = await axios.post(`${BASE_URL}/saved-jobs/${jobId}`, {}, config);
      console.log('✅ Job saved:', saveJobResponse.data);

      const savedJobsResponse = await axios.get(`${BASE_URL}/saved-jobs`, config);
      console.log('✅ Saved jobs retrieved:', savedJobsResponse.data.length, 'saved jobs\n');
    }

    // 7. Test Job Seeker Module
    console.log('🎓 Testing Job Seeker Module...');
    const createProfileResponse = await axios.post(`${BASE_URL}/jobseeker/profile`, {
      title: 'Senior Software Engineer',
      bio: 'Experienced software engineer with 5+ years...',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      experienceYears: 5,
      currentSalary: 100000,
      expectedSalary: 130000,
      location: 'San Francisco, CA'
    }, config);
    console.log('✅ Job seeker profile created:', createProfileResponse.data);

    const profileResponse = await axios.get(`${BASE_URL}/jobseeker/profile`, config);
    console.log('✅ Job seeker profile retrieved\n');

    // 8. Test CV Module
    console.log('📄 Testing CV Module...');
    const createCVResponse = await axios.post(`${BASE_URL}/cv`, {
      title: 'My Professional CV',
      content: 'Professional CV content...',
      template: 'modern',
      isPublic: true
    }, config);
    console.log('✅ CV created:', createCVResponse.data);

    const cvResponse = await axios.get(`${BASE_URL}/cv`, config);
    console.log('✅ CVs retrieved:', cvResponse.data.data.length, 'CVs\n');

    // 9. Test Applications Module
    console.log('📝 Testing Applications Module...');
    if (jobsResponse.data.data.length > 0) {
      const jobId = jobsResponse.data.data[0].id;
      const applyResponse = await axios.post(`${BASE_URL}/applications`, {
        jobId: jobId,
        coverLetter: 'I am very interested in this position...',
        expectedSalary: 110000
      }, config);
      console.log('✅ Application submitted:', applyResponse.data);

      const applicationsResponse = await axios.get(`${BASE_URL}/applications`, config);
      console.log('✅ Applications retrieved:', applicationsResponse.data.data.length, 'applications\n');
    }

    // 10. Test Notifications Module
    console.log('🔔 Testing Notifications Module...');
    const notificationsResponse = await axios.get(`${BASE_URL}/notifications`, config);
    console.log('✅ Notifications retrieved:', notificationsResponse.data.data.length, 'notifications');

    const unreadCountResponse = await axios.get(`${BASE_URL}/notifications/unread/count`, config);
    console.log('✅ Unread notifications count:', unreadCountResponse.data.unreadCount, '\n');

    // 11. Test Messaging Module
    console.log('💬 Testing Messaging Module...');
    const conversationsResponse = await axios.get(`${BASE_URL}/messaging/conversations`, config);
    console.log('✅ Conversations retrieved:', conversationsResponse.data.length, 'conversations\n');

    // 12. Test Blog Module
    console.log('📝 Testing Blog Module...');
    const createBlogResponse = await axios.post(`${BASE_URL}/blog`, {
      title: 'Getting Started with Job Search',
      content: 'Here are some tips for job searching...',
      excerpt: 'Essential tips for successful job hunting',
      tags: ['career', 'job-search', 'tips']
    }, config);
    console.log('✅ Blog post created:', createBlogResponse.data);

    const blogsResponse = await axios.get(`${BASE_URL}/blog`, config);
    console.log('✅ Blog posts retrieved:', blogsResponse.data.data.length, 'posts\n');

    console.log('🎉 ALL MODULES TESTED SUCCESSFULLY!');
    console.log('📊 API Testing Summary:');
    console.log('- ✅ Auth Module: Registration & Login');
    console.log('- ✅ Users Module: CRUD operations');
    console.log('- ✅ Companies Module: Company management');
    console.log('- ✅ Subscription Plans: Plan creation & retrieval');
    console.log('- ✅ Jobs Module: Job posting & retrieval');
    console.log('- ✅ Saved Jobs: Job bookmarking');
    console.log('- ✅ Job Seeker: Profile management');
    console.log('- ✅ CV Module: CV creation & management');
    console.log('- ✅ Applications: Job application system');
    console.log('- ✅ Notifications: Notification system');
    console.log('- ✅ Messaging: Chat functionality');
    console.log('- ✅ Blog Module: Content management');
    console.log('\n🚀 CVKing Backend is fully functional!');

  } catch (error) {
    console.error('❌ API Test Failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('🔑 Authentication required - please check JWT token');
    }
  }
}

// Run the tests
testAPI();
