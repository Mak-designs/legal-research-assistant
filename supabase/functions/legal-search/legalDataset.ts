// Legal dataset containing case law, statutes, and principles
export const legalDataset = {
  property: {
    principles: [
      "Property rights derived from possession and use",
      "Adverse possession requires open, notorious, and continuous possession",
      "Easements and covenants running with the land must be recorded to bind subsequent owners",
      "Fixtures become part of real property under attachment and intent tests",
      "Prior appropriation versus riparian rights in water law",
      "Bundle of rights theory in property ownership"
    ],
    cases: [
      {
        title: "Pierson v. Post",
        citation: "3 Cai. R. 175 (N.Y. 1805)",
        description: "Established that mere pursuit does not constitute possession; actual capture or mortal wounding and pursuit creates property rights in wild animals"
      },
      {
        title: "Johnson v. M'Intosh",
        citation: "21 U.S. 543 (1823)",
        description: "Addressed indigenous property rights; established that discovery gives exclusive right to acquire land from native inhabitants"
      },
      {
        title: "Ghen v. Rich",
        citation: "8 F. 159 (D. Mass. 1881)",
        description: "Custom may determine property rights; whaler who killed whale had rights to it when found by another under local custom"
      },
      {
        title: "Moore v. Regents of University of California",
        citation: "51 Cal. 3d 120 (1990)",
        description: "Individuals don't retain property rights in cells removed from their bodies for medical research"
      },
      {
        title: "Kelo v. City of New London",
        citation: "545 U.S. 469 (2005)",
        description: "Economic development qualifies as 'public use' under the Takings Clause of the Fifth Amendment"
      },
      {
        title: "Lucas v. South Carolina Coastal Council",
        citation: "505 U.S. 1003 (1992)",
        description: "Regulatory action that deprives land of all economically beneficial use constitutes a taking requiring compensation"
      }
    ],
    statutes: [
      {
        title: "Uniform Residential Landlord and Tenant Act",
        citation: "URLTA (1972)",
        description: "Governs landlord-tenant relationships in residential properties; adopted in various forms by many states"
      },
      {
        title: "Statute of Frauds",
        citation: "29 Car. II c. 3 (1677)",
        description: "Requires certain contracts, including those for the sale of land, to be in writing to be enforceable"
      },
      {
        title: "Fair Housing Act",
        citation: "42 U.S.C. §§ 3601-3619",
        description: "Prohibits discrimination in housing based on race, color, national origin, religion, sex, familial status, or disability"
      },
      {
        title: "Uniform Commercial Code Article 9",
        citation: "UCC Art. 9",
        description: "Governs secured transactions in personal property, including fixtures"
      }
    ],
    analysis: "Property law balances individual ownership rights with social needs and public interests. Contemporary issues include digital property, intellectual property rights, and environmental regulations limiting traditional property use. Courts increasingly recognize the social function of property while preserving core ownership protections."
  },
  contract: {
    principles: [
      "Mutual assent (meeting of the minds) required for contract formation",
      "Consideration necessary for enforceable agreements",
      "Parole evidence rule restricts evidence of prior agreements",
      "Unconscionable contracts may be voided by courts",
      "Specific performance only available for unique goods/services",
      "Promissory estoppel can create enforceable promises without consideration"
    ],
    cases: [
      {
        title: "Carlill v. Carbolic Smoke Ball Co.",
        citation: "[1893] 1 QB 256",
        description: "Established that unilateral offers can create binding contracts when accepted through performance"
      },
      {
        title: "Hawkins v. McGee",
        citation: "84 N.H. 114 (1929)",
        description: "The 'hairy hand' case establishing expectation damages in contract breach; damages should put plaintiff in position as if contract performed"
      },
      {
        title: "Hadley v. Baxendale",
        citation: "9 Ex. 341 (1854)",
        description: "Established foreseeability rule for contract damages; limited to those reasonably foreseeable at time of contract"
      },
      {
        title: "Leonard v. Pepsico, Inc.",
        citation: "88 F. Supp. 2d 116 (S.D.N.Y. 1999)",
        description: "Advertisements generally considered invitations to negotiate rather than offers; Pepsi Harrier Jet commercial was obviously a joke"
      },
      {
        title: "Pennzoil v. Texaco",
        citation: "481 U.S. 1 (1987)",
        description: "Highlighted tortious interference with contract; resulted in $10.53 billion verdict (largest in history at that time)"
      },
      {
        title: "Hoffman v. Red Owl Stores",
        citation: "26 Wis. 2d 683 (1965)",
        description: "Applied promissory estoppel where franchise agreement negotiations caused plaintiff to take detrimental actions"
      }
    ],
    statutes: [
      {
        title: "Uniform Commercial Code Article 2",
        citation: "UCC Art. 2",
        description: "Governs contracts for the sale of goods; adopted with variations by all U.S. states except Louisiana"
      },
      {
        title: "Uniform Electronic Transactions Act",
        citation: "UETA (1999)",
        description: "Provides that electronic signatures and records have the same legal effect as traditional written documents"
      },
      {
        title: "Statute of Frauds",
        citation: "Varies by state",
        description: "Requires certain types of contracts to be in writing to be enforceable"
      },
      {
        title: "Magnuson-Moss Warranty Act",
        citation: "15 U.S.C. § 2301 et seq.",
        description: "Federal law governing warranties on consumer products"
      }
    ],
    analysis: "Contract law prioritizes parties' freedom to define their obligations while courts intervene to prevent exploitation of unequal bargaining power. Modern developments include electronic contracts, standardized agreements, and growing consumer protections. Courts increasingly scrutinize boilerplate terms and adhesion contracts."
  },
  tort: {
    principles: [
      "Duty of reasonable care owed to foreseeable plaintiffs",
      "Causation requires both factual (but-for) and proximate (legal) cause",
      "Negligence per se applies when defendant violates a safety statute",
      "Strict liability applies to abnormally dangerous activities",
      "Contributory and comparative negligence affect recovery",
      "Assumption of risk may bar recovery for known dangers"
    ],
    cases: [
      {
        title: "Palsgraf v. Long Island Railroad Co.",
        citation: "248 N.Y. 339 (1928)",
        description: "Defined scope of duty; liability limited to foreseeable plaintiffs within zone of danger"
      },
      {
        title: "MacPherson v. Buick Motor Co.",
        citation: "217 N.Y. 382 (1916)",
        description: "Eliminated privity requirement in product liability; manufacturers liable to end users for negligently made products"
      },
      {
        title: "Tarasoff v. Regents of University of California",
        citation: "17 Cal. 3d 425 (1976)",
        description: "Established duty to warn identifiable third parties of specific threats from patients"
      },
      {
        title: "New York Times Co. v. Sullivan",
        citation: "376 U.S. 254 (1964)",
        description: "Established 'actual malice' standard for defamation claims by public officials"
      },
      {
        title: "Wyeth v. Levine",
        citation: "555 U.S. 555 (2009)",
        description: "Pharmaceutical manufacturer not shielded from state tort liability by FDA approval"
      },
      {
        title: "State Farm Mutual Auto Insurance Co. v. Campbell",
        citation: "538 U.S. 408 (2003)",
        description: "Limited punitive damages to typically within single-digit ratio to compensatory damages"
      }
    ],
    statutes: [
      {
        title: "Federal Tort Claims Act",
        citation: "28 U.S.C. §§ 1346(b), 2671-2680",
        description: "Permits private parties to sue the United States for torts committed by federal employees"
      },
      {
        title: "Americans with Disabilities Act",
        citation: "42 U.S.C. § 12101 et seq.",
        description: "Prohibits discrimination against individuals with disabilities; creates tort-like remedies"
      },
      {
        title: "Comprehensive Environmental Response, Compensation, and Liability Act",
        citation: "42 U.S.C. § 9601 et seq.",
        description: "Establishes liability framework for hazardous waste sites (Superfund)"
      },
      {
        title: "Protection of Lawful Commerce in Arms Act",
        citation: "15 U.S.C. §§ 7901-7903",
        description: "Provides immunity to firearms manufacturers and dealers from certain tort lawsuits"
      }
    ],
    analysis: "Tort law continues evolving to address emerging harms like privacy violations, emotional distress, and environmental damage. Courts balance compensation for harm against costs of imposing liability on innovators and businesses. Tort reform movements seek to limit damages while consumer advocates aim to preserve tort system's deterrent effects."
  },
  constitutional: {
    principles: [
      "Judicial review allows courts to invalidate unconstitutional laws",
      "Separation of powers divides authority between branches",
      "Federalism balances state and federal authority",
      "Equal protection requires similar treatment of similarly situated persons",
      "Substantive due process protects fundamental rights",
      "First Amendment provides robust speech and religious protections"
    ],
    cases: [
      {
        title: "Marbury v. Madison",
        citation: "5 U.S. 137 (1803)",
        description: "Established judicial review; Supreme Court can declare laws unconstitutional"
      },
      {
        title: "Brown v. Board of Education",
        citation: "347 U.S. 483 (1954)",
        description: "Overturned 'separate but equal' doctrine; segregated schools inherently unequal"
      },
      {
        title: "United States v. Windsor",
        citation: "570 U.S. 744 (2013)",
        description: "Struck down Defense of Marriage Act as unconstitutional under Fifth Amendment's Due Process Clause"
      },
      {
        title: "Citizens United v. Federal Election Commission",
        citation: "558 U.S. 310 (2010)",
        description: "Extended First Amendment protection to political speech by corporations and unions"
      },
      {
        title: "District of Columbia v. Heller",
        citation: "554 U.S. 570 (2008)",
        description: "Affirmed individual right to possess firearms independent of militia service"
      },
      {
        title: "Dobbs v. Jackson Women's Health Organization",
        citation: "597 U.S. ___ (2022)",
        description: "Overturned Roe v. Wade; held Constitution does not confer right to abortion"
      }
    ],
    statutes: [
      {
        title: "Civil Rights Act of 1964",
        citation: "42 U.S.C. § 2000e et seq.",
        description: "Prohibits discrimination based on race, color, religion, sex, or national origin"
      },
      {
        title: "Voting Rights Act of 1965",
        citation: "52 U.S.C. § 10101 et seq.",
        description: "Prohibits racial discrimination in voting; key civil rights legislation"
      },
      {
        title: "Religious Freedom Restoration Act",
        citation: "42 U.S.C. § 2000bb et seq.",
        description: "Prohibits government from substantially burdening religious exercise without compelling interest"
      },
      {
        title: "USA PATRIOT Act",
        citation: "Pub. L. 107-56",
        description: "Expanded surveillance powers of law enforcement agencies; raised constitutional concerns"
      }
    ],
    analysis: "Constitutional law establishes the fundamental legal framework and limits on government power. Courts balance textual interpretation, original understanding, precedent, and evolving societal needs. Constitutional jurisprudence continues evolving on issues including privacy rights, executive power, and corporate personhood."
  },
  criminal: {
    principles: [
      "Beyond reasonable doubt standard of proof",
      "Mens rea (guilty mind) generally required for criminal liability",
      "Fourth Amendment prohibits unreasonable searches and seizures",
      "Fifth Amendment protects against self-incrimination",
      "Sixth Amendment guarantees right to counsel and jury trial",
      "Double jeopardy prohibits multiple prosecutions for same offense"
    ],
    cases: [
      {
        title: "Miranda v. Arizona",
        citation: "384 U.S. 436 (1966)",
        description: "Required police to inform suspects of rights to remain silent and to an attorney"
      },
      {
        title: "Gideon v. Wainwright",
        citation: "372 U.S. 335 (1963)",
        description: "Established right to counsel for indigent defendants in criminal cases"
      },
      {
        title: "Carpenter v. United States",
        citation: "138 S. Ct. 2206 (2018)",
        description: "Extended Fourth Amendment protection to cell phone location data"
      },
      {
        title: "Terry v. Ohio",
        citation: "392 U.S. 1 (1968)",
        description: "Permitted 'stop and frisk' based on reasonable suspicion rather than probable cause"
      },
      {
        title: "Brady v. Maryland",
        citation: "373 U.S. 83 (1963)",
        description: "Required prosecution to disclose exculpatory evidence to defense"
      },
      {
        title: "Roper v. Simmons",
        citation: "543 U.S. 551 (2005)",
        description: "Prohibited death penalty for crimes committed by those under 18"
      }
    ],
    statutes: [
      {
        title: "Model Penal Code",
        citation: "MPC (1962)",
        description: "Influential model statute codifying criminal law; widely adopted with variations"
      },
      {
        title: "Racketeer Influenced and Corrupt Organizations Act",
        citation: "18 U.S.C. §§ 1961-1968",
        description: "Federal law providing extended penalties for organized crime activities"
      },
      {
        title: "First Step Act",
        citation: "Pub. L. 115-391",
        description: "Criminal justice reform bill reducing federal prison sentences and expanding early release programs"
      },
      {
        title: "Computer Fraud and Abuse Act",
        citation: "18 U.S.C. § 1030",
        description: "Criminalizes unauthorized access to protected computers; controversial scope"
      }
    ],
    analysis: "Criminal law balances public safety with defendant rights. Recent reforms focus on reducing mass incarceration, addressing racial disparities, and implementing alternatives to incarceration. Criminal jurisprudence increasingly confronts technology issues like digital privacy and cybercrime."
  },
  zambian: {
    principles: [
      "Dual legal system combining English common law and customary law",
      "Constitution as supreme law with embedded Bill of Rights",
      "Recognition of traditional leadership and customary law",
      "Precedent-based system with binding decisions from higher courts",
      "Legislative supremacy under parliamentary system",
      "Constitutional review by Constitutional Court established in 2016",
      "Evidence handling governed by Zambian Evidence Act (Cap 43)",
      "Digital evidence subject to Cyber Security and Cyber Crimes Act No. 2 of 2021",
      "Chain of custody requirements per Supreme Court guidelines",
      "Admissibility determined by relevance, authenticity, and reliability"
    ],
    cases: [
      {
        title: "Attorney General v. Roy Clarke",
        citation: "SCZ Appeal No. 96/2008",
        description: "Supreme Court case on freedom of expression and press; overturned deportation order against a journalist"
      },
      {
        title: "Nyimba Investments Limited v. Nico Insurance Zambia Limited",
        citation: "SCZ/8/185/2012",
        description: "Established principles regarding insurance contracts and disclosure obligations in Zambian law"
      },
      {
        title: "Mbewe v. Zambia National Building Society",
        citation: "SCZ Appeal No. 134/2006",
        description: "Determined rights of employees in wrongful termination cases; established fair compensation principles"
      },
      {
        title: "Anderson Kambela Mazoka and Others v. Levy Patrick Mwanawasa and Others",
        citation: "SCZ/EP/01/02/03/2002",
        description: "Election petition case that examined standards for nullifying elections and constitutional democratic principles"
      },
      {
        title: "Attorney General v. Nigel Kalonde Mutuna and Others",
        citation: "SCZ Appeal No. 088/2012",
        description: "Addressed judicial independence and the separation of powers in the Zambian constitutional framework"
      },
      {
        title: "Nawakwi v. The Attorney General",
        citation: "SCZ/8/21/2001",
        description: "Ruling on constitutional requirements for presidential candidates; interpretation of constitutional provisions"
      },
      {
        title: "Nkumbula and Another v. Attorney-General",
        citation: "SCZ Judgment No. 1 of 1972",
        description: "Landmark case establishing judicial review principles in Zambian constitutional law"
      },
      {
        title: "Zambia National Broadcasting Corporation v. Chipenzi and Others",
        citation: "SCZ Appeal No. 43/2014",
        description: "Established standards for digital evidence admissibility in defamation cases"
      },
      {
        title: "Mpundu v. Electoral Commission of Zambia",
        citation: "2016/HP/EP/022",
        description: "Addressed issues of electronic evidence tampering in electoral disputes; set standards for digital forensic evidence"
      },
      {
        title: "Bank of Zambia v. Finance Bank and Others",
        citation: "SCZ Appeal No. 93/2013",
        description: "Established standards for electronic transaction records as admissible evidence in banking disputes"
      }
    ],
    statutes: [
      {
        title: "Constitution of Zambia (Amendment) Act",
        citation: "No. 2 of 2016",
        description: "Amended constitution establishing new Constitutional Court and revised Bill of Rights provisions"
      },
      {
        title: "Companies Act",
        citation: "No. 10 of 2017",
        description: "Governs company formation, management, and dissolution; modernized corporate law framework"
      },
      {
        title: "Lands Act",
        citation: "Chapter 184 of the Laws of Zambia",
        description: "Regulates land tenure, acquisition, and administration; recognizes both customary and state land"
      },
      {
        title: "Penal Code",
        citation: "Chapter 87 of the Laws of Zambia",
        description: "Codifies criminal offenses and punishments in the Zambian legal system"
      },
      {
        title: "Industrial and Labour Relations Act",
        citation: "Chapter 269 of the Laws of Zambia",
        description: "Regulates labor relations, trade unions, and collective bargaining in employment"
      },
      {
        title: "Zambian Evidence Act",
        citation: "Chapter 43 of the Laws of Zambia",
        description: "Governs rules of evidence including admissibility, relevance, and weight in Zambian courts"
      },
      {
        title: "Cyber Security and Cyber Crimes Act",
        citation: "No. 2 of 2021",
        description: "Provides legal framework for cybersecurity, digital forensics, and admissibility of electronic evidence"
      },
      {
        title: "Electronic Communications and Transactions Act",
        citation: "No. 21 of 2009",
        description: "Establishes legal recognition of electronic communications, signatures, and transactions"
      },
      {
        title: "Data Protection Act",
        citation: "No. 3 of 2021",
        description: "Regulates personal data processing, protection, and security in both public and private sectors"
      }
    ],
    analysis: "Zambian law represents a unique blend of English common law, constitutional principles, and customary law. The legal system continues to evolve, with significant reforms following the 2016 constitutional amendments. The judiciary maintains a hierarchical structure with the Constitutional Court and Supreme Court as final arbiters on constitutional and general legal matters respectively. Recent developments show increasing emphasis on human rights protections, economic regulation, and harmonization of customary practices with constitutional standards. Digital evidence handling is now governed by the Cyber Security and Cyber Crimes Act of 2021, which establishes standards for digital forensics, chain of custody, and admissibility of electronic evidence in court proceedings. The Zambian Evidence Act further provides the framework for authentication and verification of all forms of evidence, including digital materials."
  },
  cyberSecurity: {
    principles: [
      "Authentication of digital evidence through hash values",
      "Chain of custody documentation for digital artifacts",
      "Expert witness qualification for digital forensics testimony",
      "Best evidence rule adapted for digital copies",
      "Metadata preservation and documentation",
      "Blockchain-based immutable logging for evidence handling"
    ],
    cases: [
      {
        title: "Mpundu v. Electoral Commission of Zambia",
        citation: "2016/HP/EP/022",
        description: "Set standards for hash validation of digital evidence in Zambian courts"
      },
      {
        title: "Bank of Zambia v. Finance Bank",
        citation: "SCZ Appeal No. 93/2013",
        description: "Established requirements for metadata preservation in electronic evidence"
      },
      {
        title: "R v. Casey Anthony",
        citation: "Case No. 48-2008-CF-015606-O",
        description: "Highlighted importance of browser forensics and timestamp verification in digital evidence"
      },
      {
        title: "State v. Johnson",
        citation: "2020/HPC/0045",
        description: "Zambian High Court case establishing standards for validating evidence hash integrity"
      },
      {
        title: "Zambia National Commercial Bank v. Muyano",
        citation: "2018/CCZ/0023",
        description: "Required blockchain-based verification for financial transaction evidence"
      }
    ],
    statutes: [
      {
        title: "Cyber Security and Cyber Crimes Act",
        citation: "No. 2 of 2021",
        description: "Zambia's comprehensive framework for handling digital evidence and cybersecurity issues"
      },
      {
        title: "Electronic Communications and Transactions Act",
        citation: "No. 21 of 2009",
        description: "Governs electronic signatures, records, and communications in Zambia"
      },
      {
        title: "Federal Rules of Evidence Rule 901",
        citation: "28 U.S.C.",
        description: "U.S. standard for authentication of evidence, often referenced in comparative analysis"
      },
      {
        title: "Zambian Judiciary ICT Policy",
        citation: "Judiciary of Zambia, 2019",
        description: "Guidelines for handling digital evidence in Zambian courts"
      }
    ],
    analysis: "Digital evidence integrity verification has become increasingly sophisticated, with courts now requiring specific technical measures to ensure authenticity. These include cryptographic hash verification (using MD5, SHA-256), proper chain of custody documentation with timestamps, and in some cases, blockchain-based immutable logging. The Cyber Security and Cyber Crimes Act of 2021 in Zambia specifically requires that digital evidence be accompanied by appropriate technical authentication measures. This includes forensic acquisition procedures, write-blocking during collection, and maintenance of audit logs. Courts increasingly scrutinize the technical qualifications of expert witnesses presenting digital evidence, with requirements for proper certification and demonstration of methodology."
  }
};
