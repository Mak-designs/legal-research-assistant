
-- Insert mock Zambian legal cases
INSERT INTO zambian_cases (title, citation, court_name, decision_date, case_summary, case_facts, judgment, judges, legal_domain, legal_principles, keywords) VALUES
('Mwansa v. The People', '[2023] ZMSC 45', 'Supreme Court of Zambia', '2023-03-15', 'Case involving digital evidence admissibility in criminal proceedings', 'The appellant was convicted based on digital evidence including WhatsApp messages and email communications', 'The court held that digital evidence must meet strict authentication requirements under the Cyber Security and Cyber Crimes Act', ARRAY['Hon. Justice Mumba', 'Hon. Justice Phiri', 'Hon. Justice Banda'], 'criminal', ARRAY['Digital evidence authentication', 'Chain of custody', 'Cyber crimes'], ARRAY['digital evidence', 'cybercrime', 'authentication', 'WhatsApp', 'electronic communications']),

('Kabwe Mining Corp v. Environmental Council', '[2023] ZMHC 112', 'High Court of Zambia', '2023-02-20', 'Environmental law case regarding mining operations and digital monitoring systems', 'The mining company challenged environmental monitoring requirements that mandated digital reporting systems', 'Court upheld the digital monitoring requirements as necessary for environmental protection', ARRAY['Hon. Justice Tembo'], 'environmental', ARRAY['Environmental monitoring', 'Digital compliance', 'Mining law'], ARRAY['environmental law', 'mining', 'digital monitoring', 'compliance']),

('Lusaka City Council v. Digital Solutions Ltd', '[2023] ZMHC 89', 'High Court of Zambia', '2023-01-12', 'Contract dispute involving digital service delivery platforms', 'Dispute over the implementation of a digital city services platform', 'Court ruled in favor of specific performance of digital infrastructure contracts', ARRAY['Hon. Justice Mulenga'], 'contract', ARRAY['Digital contracts', 'Specific performance', 'Government contracts'], ARRAY['digital services', 'contract law', 'government', 'technology']),

('Bank of Zambia v. FinTech Innovations', '[2022] ZMSC 78', 'Supreme Court of Zambia', '2022-12-05', 'Banking law case involving digital payment systems regulation', 'Challenge to central bank regulations on digital payment platforms', 'Supreme Court upheld the regulatory framework for digital financial services', ARRAY['Hon. Justice Malila', 'Hon. Justice Sitali'], 'banking', ARRAY['Digital banking regulation', 'Financial technology', 'Central bank authority'], ARRAY['banking law', 'fintech', 'digital payments', 'regulation']),

('Zamtel v. MTN Zambia', '[2022] ZMHC 156', 'High Court of Zambia', '2022-11-18', 'Telecommunications law dispute over digital infrastructure sharing', 'Dispute regarding access to digital telecommunications infrastructure', 'Court ordered fair access to digital infrastructure under telecommunications law', ARRAY['Hon. Justice Chinyama'], 'telecommunications', ARRAY['Infrastructure sharing', 'Digital telecommunications', 'Fair access'], ARRAY['telecommunications', 'infrastructure', 'digital networks', 'competition']),

('Ministry of Health v. MedTech Systems', '[2022] ZMHC 134', 'High Court of Zambia', '2022-10-22', 'Public procurement case involving digital health information systems', 'Dispute over the procurement of digital health management systems', 'Court emphasized transparency in digital procurement processes', ARRAY['Hon. Justice Kapula'], 'procurement', ARRAY['Digital procurement', 'Public health systems', 'Transparency'], ARRAY['procurement law', 'digital health', 'public sector', 'transparency']),

('University of Zambia v. Students Union', '[2022] ZMHC 201', 'High Court of Zambia', '2022-09-14', 'Educational law case involving digital learning platforms and student rights', 'Dispute over access to digital learning resources during remote learning', 'Court ruled on students rights to digital educational resources', ARRAY['Hon. Justice Siavwapa'], 'education', ARRAY['Digital education rights', 'Remote learning', 'Student access'], ARRAY['education law', 'digital learning', 'student rights', 'remote education']),

('ZESCO v. Solar Power Ltd', '[2022] ZMHC 89', 'High Court of Zambia', '2022-08-30', 'Energy law case involving digital grid management systems', 'Dispute over integration of renewable energy with digital grid systems', 'Court supported digital integration of renewable energy sources', ARRAY['Hon. Justice Muzeya'], 'energy', ARRAY['Digital grid management', 'Renewable energy integration', 'Smart grids'], ARRAY['energy law', 'digital grids', 'renewable energy', 'smart technology']),

('Zambia Revenue Authority v. E-Commerce Hub', '[2022] ZMHC 167', 'High Court of Zambia', '2022-07-25', 'Tax law case involving digital commerce taxation', 'Dispute over taxation of digital commerce transactions', 'Court clarified tax obligations for digital business operations', ARRAY['Hon. Justice Kondolo'], 'tax', ARRAY['Digital commerce taxation', 'E-commerce law', 'Tax compliance'], ARRAY['tax law', 'e-commerce', 'digital business', 'taxation']),

('Digital Banking Corp v. Consumer Protection Agency', '[2022] ZMHC 145', 'High Court of Zambia', '2022-06-18', 'Consumer protection case involving digital banking services', 'Consumer complaints regarding digital banking security and fraud', 'Court established standards for digital banking consumer protection', ARRAY['Hon. Justice Mbao'], 'consumer', ARRAY['Digital banking protection', 'Consumer rights', 'Financial security'], ARRAY['consumer law', 'digital banking', 'fraud protection', 'financial services']);

-- Insert mock Zambian statutes
INSERT INTO zambian_statutes (title, citation, chapter_number, section_number, statute_text, summary, legal_domain, keywords, enacted_date, status) VALUES
('Cyber Security and Cyber Crimes Act', 'Act No. 2 of 2021', 'Chapter 16:01', 'Section 15', 'Any person who unlawfully accesses or intercepts any data or computer program shall be guilty of an offence and liable to imprisonment for a term not exceeding five years or to a fine not exceeding five hundred thousand penalty units or to both', 'Criminalizes unauthorized access to computer systems and data', 'criminal', ARRAY['cybercrime', 'computer access', 'data protection', 'unauthorized access'], '2021-03-15', 'active'),

('Electronic Transactions Act', 'Act No. 21 of 2021', 'Chapter 16:02', 'Section 8', 'An electronic signature shall have the same legal effect as a handwritten signature if it meets the requirements for authentication and integrity as prescribed', 'Establishes legal framework for electronic signatures and digital transactions', 'commercial', ARRAY['electronic signatures', 'digital transactions', 'authentication', 'legal validity'], '2021-06-20', 'active'),

('Data Protection Act', 'Act No. 3 of 2021', 'Chapter 16:03', 'Section 12', 'Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject', 'Regulates the processing and protection of personal data', 'privacy', ARRAY['data protection', 'personal data', 'privacy rights', 'data processing'], '2021-04-10', 'active'),

('Digital Financial Services Act', 'Act No. 8 of 2022', 'Chapter 44:03', 'Section 5', 'No person shall provide digital financial services without a license issued by the Bank of Zambia', 'Regulates digital financial services and mobile money operations', 'banking', ARRAY['digital banking', 'mobile money', 'fintech', 'financial services'], '2022-01-30', 'active'),

('Electronic Commerce Act', 'Act No. 15 of 2020', 'Chapter 16:04', 'Section 7', 'Electronic contracts shall be valid and enforceable if they meet the requirements of offer, acceptance, and consideration', 'Provides legal framework for electronic commerce and online contracts', 'commercial', ARRAY['e-commerce', 'electronic contracts', 'online business', 'digital commerce'], '2020-12-05', 'active'),

('Telecommunications Act (Amendment)', 'Act No. 12 of 2022', 'Chapter 22:01', 'Section 45A', 'Telecommunications operators must ensure digital infrastructure sharing to promote competition and reduce costs', 'Mandates infrastructure sharing for digital telecommunications networks', 'telecommunications', ARRAY['telecommunications', 'infrastructure sharing', 'digital networks', 'competition'], '2022-05-15', 'active'),

('Public Procurement Act (Digital Amendment)', 'Act No. 18 of 2022', 'Chapter 12:02', 'Section 23B', 'All public procurement processes shall utilize digital platforms for transparency and efficiency', 'Requires digital procurement systems for government contracts', 'procurement', ARRAY['public procurement', 'digital platforms', 'transparency', 'e-procurement'], '2022-07-20', 'active'),

('Copyright and Digital Rights Act', 'Act No. 6 of 2021', 'Chapter 44:05', 'Section 18', 'Digital content creators shall have exclusive rights to their digital works and online publications', 'Protects intellectual property rights in digital content and online media', 'intellectual_property', ARRAY['copyright', 'digital rights', 'intellectual property', 'online content'], '2021-09-12', 'active'),

('Electronic Evidence Act', 'Act No. 9 of 2021', 'Chapter 4:02', 'Section 14', 'Electronic evidence shall be admissible in court proceedings if properly authenticated and its integrity is verified', 'Establishes rules for admission of electronic evidence in legal proceedings', 'evidence', ARRAY['electronic evidence', 'digital forensics', 'court proceedings', 'evidence law'], '2021-05-25', 'active'),

('Smart Cities Development Act', 'Act No. 25 of 2023', 'Chapter 35:05', 'Section 6', 'Local authorities may implement digital infrastructure projects for smart city development with appropriate data protection measures', 'Enables development of smart city technologies with privacy safeguards', 'urban_planning', ARRAY['smart cities', 'digital infrastructure', 'urban development', 'IoT'], '2023-02-18', 'active');

-- Adding more diverse legal cases with proper date casting
INSERT INTO zambian_cases (title, citation, court_name, decision_date, case_summary, case_facts, judgment, judges, legal_domain, legal_principles, keywords) 
SELECT 
  'Case ' || generate_series || ' - Digital Law Matter',
  '[202' || (2 + (generate_series % 2)) || '] ZMHC ' || (100 + generate_series),
  CASE 
    WHEN generate_series % 4 = 0 THEN 'High Court of Zambia'
    WHEN generate_series % 4 = 1 THEN 'Supreme Court of Zambia'
    WHEN generate_series % 4 = 2 THEN 'Constitutional Court of Zambia'
    ELSE 'Magistrate Court of Zambia'
  END,
  ('2023-' || LPAD((generate_series % 12 + 1)::text, 2, '0') || '-' || LPAD((generate_series % 28 + 1)::text, 2, '0'))::date,
  'Legal matter involving digital technology and Zambian law principles in case ' || generate_series,
  'Facts relating to digital evidence, electronic transactions, or cyber security matters in case ' || generate_series,
  'Court ruling on digital law matters with reference to Zambian legal precedents',
  ARRAY['Hon. Justice ' || 
    CASE generate_series % 10
      WHEN 0 THEN 'Mumba'
      WHEN 1 THEN 'Phiri'
      WHEN 2 THEN 'Banda'
      WHEN 3 THEN 'Tembo'
      WHEN 4 THEN 'Mulenga'
      WHEN 5 THEN 'Malila'
      WHEN 6 THEN 'Sitali'
      WHEN 7 THEN 'Chinyama'
      WHEN 8 THEN 'Kapula'
      ELSE 'Siavwapa'
    END],
  CASE generate_series % 8
    WHEN 0 THEN 'criminal'
    WHEN 1 THEN 'commercial'
    WHEN 2 THEN 'constitutional'
    WHEN 3 THEN 'administrative'
    WHEN 4 THEN 'family'
    WHEN 5 THEN 'property'
    WHEN 6 THEN 'employment'
    ELSE 'contract'
  END,
  ARRAY['Digital law principle ' || generate_series, 'Zambian legal standard', 'Electronic evidence rule'],
  ARRAY['digital law', 'zambian precedent', 'electronic evidence', 'cyber security']
FROM generate_series(11, 250);

-- Adding more statutes with proper date casting
INSERT INTO zambian_statutes (title, citation, chapter_number, section_number, statute_text, summary, legal_domain, keywords, enacted_date, status)
SELECT 
  'Digital Law Statute ' || generate_series,
  'Act No. ' || generate_series || ' of 202' || (1 + (generate_series % 3)),
  'Chapter ' || (10 + (generate_series % 40)) || ':0' || (1 + (generate_series % 9)),
  'Section ' || generate_series,
  'Legal provision ' || generate_series || ' regarding digital technology and electronic systems in Zambian law context',
  'Summary of digital law provision ' || generate_series || ' and its application in Zambian legal framework',
  CASE generate_series % 10
    WHEN 0 THEN 'criminal'
    WHEN 1 THEN 'commercial'
    WHEN 2 THEN 'constitutional'
    WHEN 3 THEN 'administrative'
    WHEN 4 THEN 'family'
    WHEN 5 THEN 'property'
    WHEN 6 THEN 'employment'
    WHEN 7 THEN 'banking'
    WHEN 8 THEN 'telecommunications'
    ELSE 'contract'
  END,
  ARRAY['digital technology', 'electronic systems', 'zambian law', 'legal framework'],
  ('202' || (1 + (generate_series % 3)) || '-' || LPAD((generate_series % 12 + 1)::text, 2, '0') || '-' || LPAD((generate_series % 28 + 1)::text, 2, '0'))::date,
  'active'
FROM generate_series(11, 250);
