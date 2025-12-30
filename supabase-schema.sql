-- Supabase Database Schema for Lemi Kura Peace and Security Website
-- Run this SQL in your Supabase SQL Editor

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT DEFAULT 'images/hero-bg.jpg',
    images JSONB DEFAULT '[]'::jsonb, -- New column for multiple images
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    comments JSONB DEFAULT '[]'::jsonb,
    date_display TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    age TEXT,
    gender TEXT,
    education TEXT,
    service_type TEXT,
    visit_purpose TEXT,
    staff_behavior INTEGER DEFAULT 0,
    service_speed INTEGER DEFAULT 0,
    service_quality INTEGER DEFAULT 0,
    overall_satisfaction INTEGER DEFAULT 0,
    staff_understanding INTEGER DEFAULT 0,
    employee_empathy INTEGER DEFAULT 0,
    needs_understanding INTEGER DEFAULT 0,
    suggestions TEXT,
    complaints TEXT,
    date_display TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create question_config table
CREATE TABLE IF NOT EXISTS question_config (
    id BIGSERIAL PRIMARY KEY,
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table (for public comments)
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    text TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    type TEXT DEFAULT 'public_comment',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to news" ON news
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to comments" ON comments
    FOR SELECT USING (status = 'approved');

-- Create policies for admin access (you'll need to set up authentication)
-- For now, we'll allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on news" ON news
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on feedback" ON feedback
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on question_config" ON question_config
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on comments" ON comments
    FOR ALL USING (true);

-- Insert default question configuration
INSERT INTO question_config (config) VALUES (
    '{
        "personal": [
            {
                "id": "fullName",
                "label": "ሙሉ ስም",
                "type": "text",
                "required": true,
                "placeholder": ""
            },
            {
                "id": "age",
                "label": "እድሜ",
                "type": "select",
                "required": true,
                "options": ["18-25", "26-35", "36-45", "46-55", "56+"]
            },
            {
                "id": "gender",
                "label": "ጾታ",
                "type": "select",
                "required": true,
                "options": ["ወንድ", "ሴት"]
            },
            {
                "id": "education",
                "label": "የትምህርት ደረጃ",
                "type": "select",
                "required": true,
                "options": ["የመጀመሪያ ደረጃ", "ሁለተኛ ደረጃ", "ዲፕሎማ", "ዲግሪ", "ማስተርስ", "ዶክትሬት"]
            }
        ],
        "service": [
            {
                "id": "serviceType",
                "label": "የተቀበሉት አገልግሎት",
                "type": "select",
                "required": true,
                "options": ["ቅጥር ጥበቃ አገልግሎት", "ሰላም ሰራዊት", "ግጭት መፍታት", "የማህበረሰብ ፀጥታ", "ስጋት ቦታ መለየት", "ሌላ"]
            },
            {
                "id": "visitPurpose",
                "label": "የጉብኝት ዓላማ",
                "type": "textarea",
                "required": false,
                "placeholder": "የመጡበትን ዓላማ በአጭሩ ይግለጹ..."
            }
        ],
        "rating": [
            {
                "id": "staff_behavior",
                "label": "የሰራተኞች ባህሪ እና አመለካከት",
                "type": "rating",
                "required": true
            },
            {
                "id": "service_speed",
                "label": "የአገልግሎት ፍጥነት",
                "type": "rating",
                "required": true
            },
            {
                "id": "service_quality",
                "label": "የአገልግሎት ጥራት",
                "type": "rating",
                "required": true
            },
            {
                "id": "overall_satisfaction",
                "label": "አጠቃላይ እርካታ",
                "type": "rating",
                "required": true
            }
        ],
        "empathy": [
            {
                "id": "staff_understanding",
                "label": "የተቀመጡ አመራሮች አሁላም ተገልጽሮች አሁል ትከረት ለየተወ ማገልግሎችን እንዴት ይገለጻሉ",
                "type": "rating",
                "required": true
            },
            {
                "id": "employee_empathy",
                "label": "የተቀመጡ ሰራተኞች አሁላም ተገልጽሮች አሁል ትከረት ለየተወ ማገልግሎችን እንዴት ይገለጻሉ",
                "type": "rating",
                "required": true
            },
            {
                "id": "needs_understanding",
                "label": "አማዋሽው የተቀመጡ ሰራተኞች የተገልጽሮች ፍላጎቶች በአግባቡ የሚረዱ መሆኑን እንዴት ይገለጻሉ",
                "type": "rating",
                "required": true
            }
        ],
        "text": [
            {
                "id": "suggestions",
                "label": "ለማሻሻያ ሀሳቦች",
                "type": "textarea",
                "required": false,
                "placeholder": "የአገልግሎታችንን ለማሻሻል ያሉዎትን ሀሳቦች ይጻፉ..."
            },
            {
                "id": "complaints",
                "label": "ቅሬታዎች (ካሉ)",
                "type": "textarea",
                "required": false,
                "placeholder": "ያሉዎትን ቅሬታዎች ይጻፉ..."
            }
        ]
    }'::jsonb
) ON CONFLICT DO NOTHING;

-- Insert sample news data
INSERT INTO news (title, category, excerpt, content, likes, date_display) VALUES 
(
    'የሰላምና ፀጥታ አዲስ ፕሮግራም ተጀመረ',
    'ዜና',
    'በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር...',
    'በለሚ ኩራ ክ/ከተማ አዲስ የሰላምና ፀጥታ ፕሮግራም ተጀምሯል። ይህ ፕሮግራም የማህበረሰቡን ተሳትፎ በመጨመር የወረዳውን ሰላምና ፀጥታ ለማጠናከር ይረዳል። ፕሮግራሙ የተለያዩ ክፍሎችን ያካትታል፣ ከነዚህም መካከል የማህበረሰብ ፖሊስ፣ የሰላም ኮሚቴዎች እና የወጣቶች ተሳትፎ ዋና ዋናዎቹ ናቸው።',
    12,
    'ታህሳስ 19, 2017'
),
(
    'የማህበረሰብ ስብሰባ ማስታወቂያ',
    'ማስታወቂያ',
    'ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል...',
    'ሁሉም ነዋሪዎች በታህሳስ 25 ቀን 2017 ዓ.ም በማህበረሰብ ስብሰባ እንዲሳተፉ ተጋብዘዋል። ስብሰባው በጠዋቱ 9:00 ሰዓት በወረዳ ቢሮ ይካሄዳል። በስብሰባው ላይ የሚወያዩ ዋና ዋና ጉዳዮች፣ የወረዳው የሰላምና ፀጥታ ሁኔታ፣ የማህበረሰብ ተሳትፎ እና የመጪው ዓመት እቅዶች ይሆናሉ።',
    8,
    'ታህሳስ 15, 2017'
),
(
    'የሰላም ግንባታ አስፈላጊነት',
    'ብሎግ',
    'ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው...',
    'ሰላም ማለት ከግጭት መላቀቅ ብቻ ሳይሆን፣ ዘላቂ የሆነ የማህበረሰብ መረጋጋት ማለት ነው። የሰላም ግንባታ ሂደት የሁሉንም የማህበረሰብ ክፍሎች ተሳትፎ ይጠይቃል። ይህም ከመንግስት ተቋማት ጀምሮ እስከ ግለሰብ ዜጎች ድረስ የሁሉንም ሚና ያካትታል።',
    15,
    'ታህሳስ 10, 2017'
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_config_updated_at BEFORE UPDATE ON question_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your security requirements)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMENT ON TABLE news IS 'Stores news articles and blog posts';
COMMENT ON TABLE feedback IS 'Stores service feedback and evaluations';
COMMENT ON TABLE question_config IS 'Stores dynamic question configuration for feedback forms';
COMMENT ON TABLE comments IS 'Stores public comments and user submissions';