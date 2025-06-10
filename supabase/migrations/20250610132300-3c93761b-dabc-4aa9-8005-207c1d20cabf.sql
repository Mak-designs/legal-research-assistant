
-- Create table for Zambian legal cases
CREATE TABLE public.zambian_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  citation TEXT NOT NULL,
  court_name TEXT,
  decision_date DATE,
  case_summary TEXT,
  legal_principles TEXT[],
  case_facts TEXT,
  judgment TEXT,
  judges TEXT[],
  legal_domain TEXT, -- e.g., 'criminal', 'constitutional', 'contract', 'tort', etc.
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Zambian statutes
CREATE TABLE public.zambian_statutes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  citation TEXT NOT NULL,
  chapter_number TEXT,
  section_number TEXT,
  statute_text TEXT NOT NULL,
  summary TEXT,
  legal_domain TEXT,
  keywords TEXT[],
  enacted_date DATE,
  amended_date DATE,
  status TEXT DEFAULT 'active', -- 'active', 'repealed', 'amended'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better search performance
CREATE INDEX idx_zambian_cases_legal_domain ON public.zambian_cases(legal_domain);
CREATE INDEX idx_zambian_cases_keywords ON public.zambian_cases USING GIN(keywords);
CREATE INDEX idx_zambian_cases_title ON public.zambian_cases USING GIN(to_tsvector('english', title));
CREATE INDEX idx_zambian_cases_summary ON public.zambian_cases USING GIN(to_tsvector('english', case_summary));

CREATE INDEX idx_zambian_statutes_legal_domain ON public.zambian_statutes(legal_domain);
CREATE INDEX idx_zambian_statutes_keywords ON public.zambian_statutes USING GIN(keywords);
CREATE INDEX idx_zambian_statutes_title ON public.zambian_statutes USING GIN(to_tsvector('english', title));
CREATE INDEX idx_zambian_statutes_text ON public.zambian_statutes USING GIN(to_tsvector('english', statute_text));

-- Insert sample Zambian cases (this is a subset - we'll add more via edge function)
INSERT INTO public.zambian_cases (title, citation, court_name, decision_date, case_summary, legal_principles, case_facts, legal_domain, keywords) VALUES
('Attorney General v. Nigel Mutuna & Others', '2012/SCZ/26', 'Supreme Court of Zambia', '2012-08-15', 'Landmark case establishing judicial independence principles in Zambian constitutional law', ARRAY['judicial independence', 'separation of powers', 'constitutional interpretation'], 'Case involved challenges to judicial appointments and the independence of the judiciary', 'constitutional', ARRAY['judicial independence', 'constitution', 'separation of powers']),
('Zambia Development Agency v. Konkola Copper Mines', '2018/HK/124', 'High Court of Zambia', '2018-03-22', 'Important case on mining rights and government authority in the extractive industry', ARRAY['mining rights', 'government authority', 'contractual obligations'], 'Dispute over mining licenses and compliance with environmental regulations', 'commercial', ARRAY['mining', 'contracts', 'environmental law']),
('The People v. James Mwanawasa', '2019/CC/089', 'Magistrate Court', '2019-06-10', 'Criminal case establishing precedent for digital evidence admissibility under Zambian law', ARRAY['digital evidence', 'criminal procedure', 'evidence admissibility'], 'Case involving digital forensics and electronic evidence in criminal proceedings', 'criminal', ARRAY['digital evidence', 'criminal law', 'forensics']),
('Mulungushi University v. Students Union', '2020/HK/156', 'High Court of Zambia', '2020-11-18', 'Education law case defining student rights and institutional authority', ARRAY['education rights', 'institutional authority', 'student representation'], 'Dispute between university administration and student representative body', 'education', ARRAY['education', 'student rights', 'institutional law']),
('Bank of Zambia v. Finance Bank', '2021/SC/034', 'Supreme Court of Zambia', '2021-04-12', 'Banking regulation case establishing central bank supervisory powers', ARRAY['banking regulation', 'central bank authority', 'financial supervision'], 'Case involving bank licensing and regulatory compliance', 'financial', ARRAY['banking', 'regulation', 'financial law']);

-- Insert sample Zambian statutes
INSERT INTO public.zambian_statutes (title, citation, chapter_number, section_number, statute_text, summary, legal_domain, keywords, enacted_date, status) VALUES
('Constitution of Zambia (Amendment) Act', 'Act No. 2 of 2016', 'Chapter 1', 'Article 1', 'Zambia is a unitary, indivisible, multi-party and democratic sovereign State.', 'Establishes Zambia as a democratic sovereign state with fundamental constitutional principles', 'constitutional', ARRAY['constitution', 'democracy', 'sovereignty'], '2016-01-05', 'active'),
('Cyber Security and Cyber Crimes Act', 'Act No. 2 of 2021', 'Chapter 18', 'Section 31', 'Any person who unlawfully accesses a computer or computer system commits an offence and is liable, upon conviction, to a fine not exceeding three hundred thousand penalty units or to imprisonment for a term not exceeding five years, or to both.', 'Defines cybercrime offences and penalties for unauthorized computer access', 'criminal', ARRAY['cybercrime', 'computer security', 'digital law'], '2021-03-15', 'active'),
('Electronic Communications and Transactions Act', 'Act No. 21 of 2021', 'Chapter 19', 'Section 15', 'An electronic signature is legally equivalent to a handwritten signature if it meets the requirements specified in this Act.', 'Establishes legal framework for electronic signatures and digital transactions', 'commercial', ARRAY['electronic signatures', 'digital transactions', 'e-commerce'], '2021-12-10', 'active'),
('Zambian Evidence Act', 'Chapter 43', 'Chapter 43', 'Section 42A', 'Digital evidence shall be admissible in court proceedings subject to authentication requirements and chain of custody procedures as prescribed by this Act.', 'Governs the admissibility of digital evidence in Zambian courts', 'evidence', ARRAY['digital evidence', 'court procedures', 'evidence law'], '2019-08-20', 'active'),
('Anti-Corruption Act', 'Act No. 3 of 2012', 'Chapter 91', 'Section 12', 'Any person who solicits, accepts or obtains any gratification as an inducement or reward for doing any act in relation to his principal''s affairs commits an offence.', 'Defines corruption offences and establishes anti-corruption framework', 'criminal', ARRAY['corruption', 'anti-corruption', 'public service'], '2012-05-15', 'active');
