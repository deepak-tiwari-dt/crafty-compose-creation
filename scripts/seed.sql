
-- Engineering Resource Management System - Database Seed Script
-- This script populates the database with sample data for demonstration

-- Insert sample profiles (users)
INSERT INTO public.profiles (id, email, name, role, skills, seniority, max_capacity, department) VALUES
-- Managers
('00000000-0000-0000-0000-000000000001', 'sarah.manager@company.com', 'Sarah Johnson', 'manager', '{"Project Management", "Team Leadership", "Strategy"}', 'senior', 100, 'Engineering'),
('00000000-0000-0000-0000-000000000002', 'mike.lead@company.com', 'Mike Chen', 'manager', '{"Technical Leadership", "Architecture", "Mentoring"}', 'senior', 100, 'Engineering'),

-- Senior Engineers
('00000000-0000-0000-0000-000000000003', 'alex.senior@company.com', 'Alex Rodriguez', 'engineer', '{"React", "TypeScript", "Node.js", "AWS", "System Design"}', 'senior', 100, 'Frontend'),
('00000000-0000-0000-0000-000000000004', 'emma.fullstack@company.com', 'Emma Wilson', 'engineer', '{"Python", "Django", "PostgreSQL", "React", "DevOps"}', 'senior', 100, 'Backend'),
('00000000-0000-0000-0000-000000000005', 'david.architect@company.com', 'David Kumar', 'engineer', '{"Java", "Spring", "Microservices", "Kubernetes", "System Architecture"}', 'senior', 100, 'Backend'),

-- Mid-level Engineers
('00000000-0000-0000-0000-000000000006', 'lisa.frontend@company.com', 'Lisa Thompson', 'engineer', '{"React", "Vue.js", "CSS", "JavaScript", "UI/UX"}', 'mid', 100, 'Frontend'),
('00000000-0000-0000-0000-000000000007', 'james.backend@company.com', 'James Park', 'engineer', '{"Node.js", "Express", "MongoDB", "API Design"}', 'mid', 100, 'Backend'),
('00000000-0000-0000-0000-000000000008', 'sofia.mobile@company.com', 'Sofia Garcia', 'engineer', '{"React Native", "Swift", "Kotlin", "Mobile Development"}', 'mid', 100, 'Mobile'),
('00000000-0000-0000-0000-000000000009', 'ryan.devops@company.com', 'Ryan Mitchell', 'engineer', '{"Docker", "AWS", "CI/CD", "Terraform", "Monitoring"}', 'mid', 100, 'DevOps'),

-- Junior Engineers
('00000000-0000-0000-0000-000000000010', 'anna.junior@company.com', 'Anna Lee', 'engineer', '{"JavaScript", "React", "HTML", "CSS"}', 'junior', 100, 'Frontend'),
('00000000-0000-0000-0000-000000000011', 'tom.newgrad@company.com', 'Tom Williams', 'engineer', '{"Python", "Flask", "SQL", "Git"}', 'junior', 100, 'Backend'),
('00000000-0000-0000-0000-000000000012', 'maria.intern@company.com', 'Maria Gonzalez', 'engineer', '{"Java", "Spring Boot", "MySQL", "Testing"}', 'junior', 100, 'Backend');

-- Insert sample projects
INSERT INTO public.projects (id, name, description, start_date, end_date, required_skills, team_size, status, manager_id) VALUES
-- Active Projects
('10000000-0000-0000-0000-000000000001', 'E-Commerce Platform Redesign', 'Complete overhaul of the customer-facing e-commerce platform with modern React architecture and improved performance.', '2024-01-15', '2024-06-30', '{"React", "TypeScript", "Node.js", "PostgreSQL", "AWS"}', 5, 'active', '00000000-0000-0000-0000-000000000001'),

('10000000-0000-0000-0000-000000000002', 'Mobile App Development', 'Native mobile application for iOS and Android with real-time features and offline capabilities.', '2024-02-01', '2024-08-15', '{"React Native", "Swift", "Kotlin", "Firebase", "API Integration"}', 4, 'active', '00000000-0000-0000-0000-000000000002'),

('10000000-0000-0000-0000-000000000003', 'Microservices Migration', 'Migration from monolith to microservices architecture with containerization and service mesh.', '2024-01-01', '2024-09-30', '{"Java", "Spring", "Docker", "Kubernetes", "System Architecture"}', 6, 'active', '00000000-0000-0000-0000-000000000001'),

-- Planning Projects
('10000000-0000-0000-0000-000000000004', 'AI-Powered Analytics Dashboard', 'Development of machine learning powered analytics dashboard for business intelligence.', '2024-04-01', '2024-12-31', '{"Python", "Machine Learning", "React", "Data Visualization", "PostgreSQL"}', 4, 'planning', '00000000-0000-0000-0000-000000000002'),

('10000000-0000-0000-0000-000000000005', 'Customer Support Portal', 'Self-service customer support portal with chatbot integration and knowledge base.', '2024-05-01', '2024-10-15', '{"React", "Node.js", "NLP", "API Integration", "Database Design"}', 3, 'planning', '00000000-0000-0000-0000-000000000001'),

-- Completed Project
('10000000-0000-0000-0000-000000000006', 'Security Audit and Hardening', 'Comprehensive security audit and implementation of security best practices across all systems.', '2023-10-01', '2024-01-15', '{"Security", "DevOps", "Penetration Testing", "Compliance"}', 2, 'completed', '00000000-0000-0000-0000-000000000002');

-- Insert sample assignments
INSERT INTO public.assignments (id, engineer_id, project_id, allocation_percentage, start_date, end_date, role) VALUES
-- E-Commerce Platform Redesign assignments
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 80, '2024-01-15', '2024-06-30', 'Tech Lead'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 100, '2024-01-15', '2024-06-30', 'Frontend Developer'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 70, '2024-01-15', '2024-06-30', 'Backend Developer'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 90, '2024-02-01', '2024-06-30', 'Junior Frontend Developer'),

-- Mobile App Development assignments
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 100, '2024-02-01', '2024-08-15', 'Mobile Lead Developer'),
('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 60, '2024-02-15', '2024-08-15', 'Backend Integration'),
('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', 80, '2024-03-01', '2024-08-15', 'API Developer'),

-- Microservices Migration assignments
('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 90, '2024-01-01', '2024-09-30', 'Solutions Architect'),
('20000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', 100, '2024-01-15', '2024-09-30', 'DevOps Engineer'),
('20000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000003', 70, '2024-02-01', '2024-09-30', 'Backend Developer'),
('20000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 30, '2024-01-01', '2024-05-31', 'API Specialist'),

-- Some engineers with partial allocations for demonstration
('20000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', 20, '2024-05-01', '2024-10-15', 'Technical Advisor'),
('20000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 40, '2024-04-01', '2024-12-31', 'Data Engineer');

-- Add some comments to explain the sample data structure
COMMENT ON TABLE public.profiles IS 'Sample profiles include managers and engineers across different seniority levels and departments';
COMMENT ON TABLE public.projects IS 'Sample projects represent different phases (planning, active, completed) with realistic timelines and skill requirements';
COMMENT ON TABLE public.assignments IS 'Sample assignments show various allocation percentages and roles, demonstrating partial and full-time commitments';
