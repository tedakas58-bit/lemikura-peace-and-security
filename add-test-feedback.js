// Script to add test feedback data for testing export functions
console.log('🧪 Adding test feedback data...');

const testFeedbacks = [
    {
        fullName: 'አበበ ከበደ',
        age: '26-35',
        gender: 'male',
        education: 'degree',
        serviceType: 'security_guard',
        visitPurpose: 'የፀጥታ አገልግሎት ለመጠየቅ መጥቻለሁ። በጣም ጥሩ አገልግሎት ነው።',
        staff_behavior: '5',
        service_speed: '4',
        service_quality: '5',
        overall_satisfaction: '4',
        suggestions: 'በጣም ጥሩ አገልግሎት ነው። ይህንን ይቀጥሉ።',
        complaints: '',
        timestamp: new Date('2024-12-20T10:30:00').toISOString(),
        date: new Date('2024-12-20').toLocaleDateString('am-ET')
    },
    {
        fullName: 'ፋጢማ አህመድ',
        age: '36-45',
        gender: 'female',
        education: 'diploma',
        serviceType: 'peace_force',
        visitPurpose: 'የሰላም ሰራዊት አገልግሎት ለመጠየቅ',
        staff_behavior: '4',
        service_speed: '5',
        service_quality: '4',
        overall_satisfaction: '5',
        suggestions: 'ፈጣን እና ጥሩ አገልግሎት። በጣም እናመሰግናለን።',
        complaints: 'ምንም ቅሬታ የለም',
        timestamp: new Date('2024-12-21T14:15:00').toISOString(),
        date: new Date('2024-12-21').toLocaleDateString('am-ET')
    },
    {
        fullName: 'ዳዊት ተስፋዬ',
        age: '18-25',
        gender: 'male',
        education: 'secondary',
        serviceType: 'conflict_resolution',
        visitPurpose: 'ግጭት መፍታት አገልግሎት ለመጠየቅ',
        staff_behavior: '3',
        service_speed: '3',
        service_quality: '4',
        overall_satisfaction: '3',
        suggestions: 'የበለጠ ማሻሻል ያስፈልጋል። ፍጥነቱን ማሻሻል ይኖርባቸዋል።',
        complaints: 'ትንሽ ዘግይቷል። የበለጠ ፈጣን አገልግሎት ይፈልጋል።',
        timestamp: new Date('2024-12-22T09:45:00').toISOString(),
        date: new Date('2024-12-22').toLocaleDateString('am-ET')
    },
    {
        fullName: 'ሳራ ገብሬ',
        age: '46-55',
        gender: 'female',
        education: 'masters',
        serviceType: 'community_security',
        visitPurpose: 'የማህበረሰብ ፀጥታ ጉዳይ ለማነሳሳት',
        staff_behavior: '5',
        service_speed: '5',
        service_quality: '5',
        overall_satisfaction: '5',
        suggestions: 'እጅግ በጣም ጥሩ አገልግሎት። ሁሉም ነገር ፍጹም ነው።',
        complaints: '',
        timestamp: new Date('2024-12-23T16:20:00').toISOString(),
        date: new Date('2024-12-23').toLocaleDateString('am-ET')
    },
    {
        fullName: 'መሀመድ ዩሱፍ',
        age: '56+',
        gender: 'male',
        education: 'primary',
        serviceType: 'risk_assessment',
        visitPurpose: 'ስጋት ቦታ መለየት አገልግሎት',
        staff_behavior: '4',
        service_speed: '3',
        service_quality: '4',
        overall_satisfaction: '4',
        suggestions: 'ጥሩ አገልግሎት ነው። ትንሽ ማሻሻል ይኖርበታል።',
        complaints: 'ትንሽ ዘግይቷል ግን በአጠቃላይ ጥሩ ነው።',
        timestamp: new Date('2024-12-24T11:10:00').toISOString(),
        date: new Date('2024-12-24').toLocaleDateString('am-ET')
    }
];

// Add to localStorage
localStorage.setItem('feedbackSurveys', JSON.stringify(testFeedbacks));

console.log('✅ Test feedback data added successfully!');
console.log(`📊 Added ${testFeedbacks.length} feedback entries`);
console.log('🔍 Data preview:', testFeedbacks[0]);

// Verify the data was saved
const savedData = localStorage.getItem('feedbackSurveys');
if (savedData) {
    const parsed = JSON.parse(savedData);
    console.log(`✅ Verification: ${parsed.length} feedbacks saved to localStorage`);
} else {
    console.error('❌ Failed to save data to localStorage');
}