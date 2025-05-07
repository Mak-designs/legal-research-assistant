
// Simplified legal dataset for the ai-legal-research edge function

// Define the types for our dataset
type LegalCase = {
  id: string;
  title: string;
  citation: string;
  description: string;
};

type Statute = {
  id: string;
  title: string;
  citation: string;
  description: string;
};

type LegalDomainData = {
  cases: LegalCase[];
  statutes: Statute[];
  principles: string[];
};

type LegalDataset = {
  [domain: string]: LegalDomainData;
};

// Create a basic dataset with representative cases, statutes and principles
export const legalDataset: LegalDataset = {
  property: {
    cases: [
      {
        id: "p1",
        title: "Pierson v. Post",
        citation: "3 Cai. R. 175 (1805)",
        description: "Established principles of property acquisition through pursuit of wild animals."
      },
      {
        id: "p2",
        title: "Johnson v. M'Intosh",
        citation: "21 U.S. 543 (1823)",
        description: "Addressed native land rights and the doctrine of discovery."
      },
      {
        id: "p3",
        title: "Keeble v. Hickeringill",
        citation: "103 Eng. Rep. 1127 (1707)",
        description: "Established protection for lawful business interests against malicious interference."
      }
    ],
    statutes: [
      {
        id: "ps1",
        title: "Statute of Frauds",
        citation: "29 Car. II c. 3",
        description: "Requires certain contracts to be in writing, including land contracts."
      },
      {
        id: "ps2",
        title: "Recording Acts",
        citation: "Various state statutes",
        description: "Governs the recording of real property instruments like deeds and mortgages."
      }
    ],
    principles: [
      "First in time, first in right",
      "Possession as notice to the world",
      "Bona fide purchaser doctrine",
      "Adverse possession requires open, notorious, exclusive, continuous use"
    ]
  },
  contract: {
    cases: [
      {
        id: "c1",
        title: "Hadley v. Baxendale",
        citation: "9 Exch. 341 (1854)",
        description: "Established the foreseeability rule for contract damages."
      },
      {
        id: "c2",
        title: "Carlill v. Carbolic Smoke Ball Co.",
        citation: "1 QB 256 (1893)",
        description: "Established principles of unilateral contracts and intent to be bound."
      },
      {
        id: "c3",
        title: "Lucy v. Zehmer",
        citation: "196 Va. 493 (1954)",
        description: "Objective theory of contracts - jests can form binding contracts if appearing serious."
      }
    ],
    statutes: [
      {
        id: "cs1",
        title: "Uniform Commercial Code (UCC)",
        citation: "U.C.C.",
        description: "Governs sales of goods and commercial transactions."
      },
      {
        id: "cs2",
        title: "Restatement (Second) of Contracts",
        citation: "Rest. 2d Contracts",
        description: "Authoritative summary of common law contract principles."
      }
    ],
    principles: [
      "Offer, acceptance, and consideration required for contract formation",
      "Substantial performance doctrine",
      "Expectation damages as default remedy",
      "Contracts require mutual assent and meeting of the minds"
    ]
  },
  tort: {
    cases: [
      {
        id: "t1",
        title: "Palsgraf v. Long Island Railroad Co.",
        citation: "248 N.Y. 339 (1928)",
        description: "Established limits of liability based on foreseeability of harm."
      },
      {
        id: "t2",
        title: "MacPherson v. Buick Motor Co.",
        citation: "217 N.Y. 382 (1916)",
        description: "Established manufacturer liability to end users despite lack of privity."
      },
      {
        id: "t3",
        title: "Donoghue v. Stevenson",
        citation: "UKHL 100 (1932)",
        description: "Established modern negligence principles and duty of care."
      }
    ],
    statutes: [
      {
        id: "ts1",
        title: "Federal Tort Claims Act",
        citation: "28 U.S.C. §§ 1346(b), 2671-2680",
        description: "Allows tort suits against the United States government."
      },
      {
        id: "ts2",
        title: "Various State Tort Reform Statutes",
        citation: "Various",
        description: "Limits damages in certain tort actions, especially medical malpractice."
      }
    ],
    principles: [
      "Duty, breach, causation, and damages required for negligence",
      "Res ipsa loquitur doctrine",
      "Comparative and contributory negligence",
      "Strict liability for abnormally dangerous activities"
    ]
  },
  constitutional: {
    cases: [
      {
        id: "con1",
        title: "Marbury v. Madison",
        citation: "5 U.S. 137 (1803)",
        description: "Established judicial review and the Supreme Court's power to invalidate laws."
      },
      {
        id: "con2",
        title: "Brown v. Board of Education",
        citation: "347 U.S. 483 (1954)",
        description: "Ended segregation in public schools, overturning 'separate but equal' doctrine."
      },
      {
        id: "con3",
        title: "Roe v. Wade",
        citation: "410 U.S. 113 (1973)",
        description: "Established constitutional right to abortion based on privacy rights."
      }
    ],
    statutes: [
      {
        id: "cons1",
        title: "Civil Rights Act of 1964",
        citation: "42 U.S.C. § 2000e et seq.",
        description: "Prohibits discrimination based on race, color, religion, sex, or national origin."
      },
      {
        id: "cons2",
        title: "Voting Rights Act of 1965",
        citation: "52 U.S.C. § 10101 et seq.",
        description: "Prohibits racial discrimination in voting practices."
      }
    ],
    principles: [
      "Separation of powers",
      "Federalism and state sovereignty",
      "Individual rights protection",
      "Equal protection under law"
    ]
  },
  criminal: {
    cases: [
      {
        id: "cr1",
        title: "Miranda v. Arizona",
        citation: "384 U.S. 436 (1966)",
        description: "Established requirement for police to inform arrestees of their rights."
      },
      {
        id: "cr2",
        title: "Gideon v. Wainwright",
        citation: "372 U.S. 335 (1963)",
        description: "Established right to counsel for indigent defendants."
      },
      {
        id: "cr3",
        title: "Mapp v. Ohio",
        citation: "367 U.S. 643 (1961)",
        description: "Established exclusionary rule for unconstitutionally obtained evidence."
      }
    ],
    statutes: [
      {
        id: "crs1",
        title: "Model Penal Code",
        citation: "MPC",
        description: "Influential model criminal code developed by legal scholars."
      },
      {
        id: "crs2",
        title: "Federal Rules of Criminal Procedure",
        citation: "Fed. R. Crim. P.",
        description: "Rules governing criminal proceedings in federal courts."
      }
    ],
    principles: [
      "Beyond reasonable doubt standard",
      "Presumption of innocence",
      "Prohibition against double jeopardy",
      "Elements of crimes must be proven"
    ]
  },
  zambian: {
    cases: [
      {
        id: "z1",
        title: "Attorney General v. Nigel Mutuna & Others",
        citation: "2012/SCZ/26",
        description: "Established judicial independence principles in Zambian law."
      },
      {
        id: "z2",
        title: "Development Bank of Zambia v. Sunvest Limited",
        citation: "1995-1997 ZR 187",
        description: "Key case on contract enforcement and remedies in Zambia."
      },
      {
        id: "z3",
        title: "Nkumbula v. Attorney General",
        citation: "1972 ZR 111",
        description: "Important case on constitutional interpretation in Zambia."
      }
    ],
    statutes: [
      {
        id: "zs1",
        title: "Constitution of Zambia (Amendment) Act, No. 2 of 2016",
        citation: "Act No. 2 of 2016",
        description: "The Constitution of Zambia, as amended in 2016."
      },
      {
        id: "zs2",
        title: "Cyber Security and Cyber Crimes Act No. 2 of 2021",
        citation: "Act No. 2 of 2021",
        description: "Governs cybersecurity and digital evidence in Zambia."
      }
    ],
    principles: [
      "English common law applies except where modified by statute",
      "Customary law applies where appropriate",
      "Constitutional supremacy",
      "Judicial independence"
    ]
  },
  cyberSecurity: {
    cases: [
      {
        id: "cy1",
        title: "United States v. Jones",
        citation: "565 U.S. 400 (2012)",
        description: "GPS tracking and digital surveillance evidence standards."
      },
      {
        id: "cy2",
        title: "Riley v. California",
        citation: "573 U.S. 373 (2014)",
        description: "Established protections for cell phone data during searches."
      },
      {
        id: "cy3",
        title: "Carpenter v. United States",
        citation: "585 U.S. ___ (2018)",
        description: "Privacy expectations in cell-site location information."
      }
    ],
    statutes: [
      {
        id: "cys1",
        title: "Computer Fraud and Abuse Act",
        citation: "18 U.S.C. § 1030",
        description: "Federal law prohibiting unauthorized access to computers."
      },
      {
        id: "cys2",
        title: "Electronic Communications Privacy Act",
        citation: "18 U.S.C. §§ 2510-2523",
        description: "Regulates interception of digital communications."
      }
    ],
    principles: [
      "Digital evidence must be authenticated",
      "Chain of custody must be maintained for digital evidence",
      "Hash verification ensures data integrity",
      "Best evidence rule applies to digital evidence"
    ]
  }
};
