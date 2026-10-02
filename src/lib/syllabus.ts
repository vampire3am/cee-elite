import { Subject } from '@/types';

export interface ChapterInfo {
  name: string;
  subject: Subject;
  yieldScore: number; // 0 - 100 based on CEE past paper trend weight
  pastQuestionFrequency: number;
  conceptImportance: number;
  topics: {
    name: string;
    yieldScore: number;
    keyConcepts: string[];
    commonTraps: string[];
  }[];
}

export const CEE_SYLLABUS: Record<Subject, ChapterInfo[]> = {
  Physics: [
    {
      name: 'Electrostatics & Capacitance',
      subject: 'Physics',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      topics: [
        {
          name: 'Capacitance & Dielectrics',
          yieldScore: 98,
          keyConcepts: ['Dielectric breakdown', 'Energy stored with/without battery', 'Kirchhoff in capacitive circuits'],
          commonTraps: ['Forgetting whether battery remains connected or disconnected when dielectric inserted', 'Charge conservation vs potential constancy']
        },
        {
          name: 'Electric Field & Potential',
          yieldScore: 92,
          keyConcepts: ['Gauss law cylindrical/spherical symmetry', 'Equipotential surfaces', 'Work done in conservative field'],
          commonTraps: ['Zero electric field does not imply zero potential', 'Sign of work done by field vs external agent']
        }
      ]
    },
    {
      name: 'Current Electricity & Circuits',
      subject: 'Physics',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      topics: [
        {
          name: 'Potentiometer & Meter Bridge',
          yieldScore: 96,
          keyConcepts: ['Null point condition', 'Internal resistance measurement', 'Sensitivity tuning via series resistance'],
          commonTraps: ['Current flowing through galvanometer at null deflection is zero, but current still flows through main potentiometer wire']
        },
        {
          name: 'Kirchhoff Laws & Circuit Networks',
          yieldScore: 91,
          keyConcepts: ['Nodal analysis', 'Delta-Star conversion', 'Symmetry in resistor cubes'],
          commonTraps: ['Sign conventions in loop equations with multiple opposing EMFs']
        }
      ]
    },
    {
      name: 'Thermodynamics & Heat',
      subject: 'Physics',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      topics: [
        {
          name: 'First & Second Laws & Carnot Engine',
          yieldScore: 95,
          keyConcepts: ['Carnot efficiency eta = 1 - T2/T1', 'Isothermal vs adiabatic slopes', 'Indicator diagrams work calculation'],
          commonTraps: ['Temperatures must strictly be in Kelvin, not Celsius', 'Adiabatic bulk modulus is gamma*P, not P']
        },
        {
          name: 'Kinetic Theory of Gases',
          yieldScore: 89,
          keyConcepts: ['Degrees of freedom', 'Equipartition of energy', 'Vrms vs Vavg vs Vmp ratios'],
          commonTraps: ['Neglecting vibrational degrees of freedom only at ordinary room temperature']
        }
      ]
    },
    {
      name: 'Modern Physics & Nuclear',
      subject: 'Physics',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      topics: [
        {
          name: 'Photoelectric Effect & Photons',
          yieldScore: 97,
          keyConcepts: ['Stopping potential independent of intensity', 'Einstein equation', 'Threshold frequency & wavelength'],
          commonTraps: ['Intensity determines saturation current, while frequency determines stopping potential and max KE']
        },
        {
          name: 'Nuclear Physics & Radioactivity',
          yieldScore: 94,
          keyConcepts: ['Decay constant lambda', 'Half-life & mean-life relation', 'Mass defect and binding energy per nucleon curve'],
          commonTraps: ['Fraction remaining is (1/2)^(t/T), fraction decayed is 1 - (1/2)^(t/T)']
        },
        {
          name: 'Bohr Model & Atomic Spectra',
          yieldScore: 93,
          keyConcepts: ['Energy levels En = -13.6 Z^2 / n^2 eV', 'Rydberg formula for Lyman, Balmer, Paschen series'],
          commonTraps: ['Series limit corresponds to transition from n = infinity, not n = 1']
        }
      ]
    },
    {
      name: 'Optics',
      subject: 'Physics',
      yieldScore: 90,
      pastQuestionFrequency: 92,
      conceptImportance: 89,
      topics: [
        {
          name: 'Wave Optics & Interference (YDSE)',
          yieldScore: 93,
          keyConcepts: ['Fringe width beta = lambda*D/d', 'Immersion in liquid changes lambda to lambda/mu', 'Phase difference vs path difference'],
          commonTraps: ['Fringe shift due to thin mica sheet does not alter the fringe width']
        },
        {
          name: 'Ray Optics & Optical Instruments',
          yieldScore: 88,
          keyConcepts: ['Compound microscope & astronomical telescope magnification', 'Total Internal Reflection & Critical Angle'],
          commonTraps: ['Sign convention in Lens Maker equation (R1 > 0, R2 < 0 for biconvex lens)']
        }
      ]
    },
    {
      name: 'Mechanics & Rotational Motion',
      subject: 'Physics',
      yieldScore: 88,
      pastQuestionFrequency: 90,
      conceptImportance: 87,
      topics: [
        {
          name: 'Rotational Dynamics & Moment of Inertia',
          yieldScore: 91,
          keyConcepts: ['Parallel and perpendicular axis theorems', 'Rolling without slipping acceleration a = g sin(theta) / (1 + k^2/R^2)', 'Conservation of angular momentum'],
          commonTraps: ['Perpendicular axis theorem is valid only for planar 2D laminar bodies']
        },
        {
          name: 'Work, Energy & Power',
          yieldScore: 86,
          keyConcepts: ['Work-Energy Theorem', 'Conservative vs Non-conservative forces', 'Vertical circular motion critical velocities'],
          commonTraps: ['Tension at top of vertical loop is T = 0 when v = sqrt(g*R), not v = 0']
        }
      ]
    }
  ],

  Chemistry: [
    {
      name: 'Organic Chemistry: Mechanisms & Functional Groups',
      subject: 'Chemistry',
      yieldScore: 96,
      pastQuestionFrequency: 98,
      conceptImportance: 95,
      topics: [
        {
          name: 'Aldehydes, Ketones & Carboxylic Acids',
          yieldScore: 98,
          keyConcepts: ['Aldol condensation vs Cannizzaro reaction', 'Nucleophilic addition kinetics', 'Haloform test for CH3-C=O groups'],
          commonTraps: ['Aldehydes with alpha-hydrogens undergo Aldol, without alpha-hydrogen undergo Cannizzaro in conc. NaOH']
        },
        {
          name: 'Reaction Mechanisms (SN1, SN2, E1, E2)',
          yieldScore: 97,
          keyConcepts: ['Carbocation rearrangement in SN1', 'Walden inversion in SN2', 'Saytzeff vs Hoffmann elimination'],
          commonTraps: ['Polar protic solvent accelerates SN1; polar aprotic solvent favors SN2']
        },
        {
          name: 'Amines & Diazonium Salts',
          yieldScore: 93,
          keyConcepts: ['Hinsberg reagent test (1st, 2nd, 3rd amines)', 'Sandmeyer and Gattermann reactions', 'Basicity order in gaseous vs aqueous medium'],
          commonTraps: ['Aqueous basicity of methyl amines is 2 > 1 > 3 > NH3, while for ethyl amines it is 2 > 3 > 1 > NH3']
        }
      ]
    },
    {
      name: 'Physical Chemistry: Chemical & Ionic Equilibrium',
      subject: 'Chemistry',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 94,
      topics: [
        {
          name: 'Ionic Equilibrium & Buffers',
          yieldScore: 97,
          keyConcepts: ['Henderson-Hasselbalch equation', 'Solubility Product (Ksp) vs Common Ion effect', 'Hydrolysis of salts of weak acid/strong base'],
          commonTraps: ['Dilution of acidic buffer does not change pH, but capacity decreases', 'Precipitation occurs only if ionic product exceeds Ksp']
        },
        {
          name: 'Chemical Kinetics',
          yieldScore: 92,
          keyConcepts: ['Integrated rate laws (0, 1st, 2nd order)', 'Arrhenius equation log(k2/k1) = Ea/2.303R (1/T1 - 1/T2)', 'Pseudo-first order reactions'],
          commonTraps: ['Half-life of first-order reaction is completely independent of initial concentration']
        },
        {
          name: 'Electrochemistry & Nernst Equation',
          yieldScore: 93,
          keyConcepts: ['Nernst equation Ecell = E0 - (0.0591/n) log Q at 298K', 'Kohlrausch Law for weak electrolytes', 'Faraday laws of electrolysis'],
          commonTraps: ['Standard cell potential is an intensive property and does not multiply by stoichiometry coefficient, but delta G does']
        }
      ]
    },
    {
      name: 'Inorganic Chemistry: Coordination & Periodic Trends',
      subject: 'Chemistry',
      yieldScore: 91,
      pastQuestionFrequency: 93,
      conceptImportance: 90,
      topics: [
        {
          name: 'Coordination Compounds',
          yieldScore: 95,
          keyConcepts: ['Crystal Field Splitting Energy (CFSE)', 'Spectrochemical series strong vs weak field ligands', 'Isomerism (linkage, coordination, optical)'],
          commonTraps: ['d8 square planar complexes (e.g., [Ni(CN)4]2-) are diamagnetic with dsp2 hybridization']
        },
        {
          name: 'd- and f-Block Elements & Metallurgy',
          yieldScore: 89,
          keyConcepts: ['Lanthanoid contraction consequences', 'Magnetic moment mu = sqrt(n(n+2)) BM', 'Catalytic properties and variable oxidation states'],
          commonTraps: ['Similarity in atomic radii of Zr and Hf is due to lanthanoid contraction']
        },
        {
          name: 'Chemical Bonding & Molecular Structure',
          yieldScore: 92,
          keyConcepts: ['VSEPR geometries with lone pair repulsions', 'Molecular Orbital Theory bond orders (O2, N2, CO, NO+)', 'Hydrogen bonding strength'],
          commonTraps: ['Mixing of 2s-2p orbitals occurs for molecules with <= 14 electrons (pi 2px = pi 2py below sigma 2pz)']
        }
      ]
    }
  ],

  Biology: [
    {
      name: 'Genetics & Molecular Biology',
      subject: 'Biology',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      topics: [
        {
          name: 'Molecular Genetics: Replication, Transcription, Translation',
          yieldScore: 99,
          keyConcepts: ['Direction of DNA polymerase (5 to 3)', 'Genetic code degeneracy and wobble hypothesis', 'Lac Operon positive and negative regulation', 'Post-transcriptional processing in eukaryotes'],
          commonTraps: ['Template strand is 3 to 5, resulting in 5 to 3 mRNA synthesis', 'Introns are spliced out in hnRNA to form mature mRNA in eukaryotes only']
        },
        {
          name: 'Mendelian Genetics & Linkage',
          yieldScore: 95,
          keyConcepts: ['Incomplete dominance vs Codominance (ABO blood group)', 'Morgan linkage experiment & recombination frequency', 'Sex-linked inheritance (Haemophilia, Color blindness)'],
          commonTraps: ['X-linked recessive disorders transmit from carrier mother to sons (50%), not father to son']
        }
      ]
    },
    {
      name: 'Human Physiology',
      subject: 'Biology',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      topics: [
        {
          name: 'Endocrine System & Hormonal Control',
          yieldScore: 98,
          keyConcepts: ['Negative feedback axes (Hypothalamus-Pituitary-Target)', 'Steroid vs peptide hormone mechanism of action', 'Adrenal cortex vs medulla hormones (Aldosterone, Cortisol)'],
          commonTraps: ['Steroid hormones cross plasma membrane and bind to intracellular/nuclear receptors; peptide hormones require secondary messengers (cAMP, IP3)']
        },
        {
          name: 'Circulation, Cardiac Cycle & Blood',
          yieldScore: 95,
          keyConcepts: ['Cardiac output = Stroke volume * Heart rate', 'ECG waveforms (P-wave, QRS complex, T-wave repolarization)', 'Erythroblastosis fetalis Rh incompatibility'],
          commonTraps: ['T-wave represents ventricular repolarization (relaxation), not atrial repolarization']
        },
        {
          name: 'Excretory System & Counter-Current Mechanism',
          yieldScore: 94,
          keyConcepts: ['Loop of Henle counter-current multiplier and vasa recta exchanger', 'RAAS system (Renin from JGA, Angiotensin II, Aldosterone)', 'ADH regulation of collecting duct aquaporins'],
          commonTraps: ['Descending limb of Henle is permeable to water but impermeable to electrolytes; ascending limb is impermeable to water']
        },
        {
          name: 'Nervous System & Nerve Impulse Conduction',
          yieldScore: 93,
          keyConcepts: ['Resting membrane potential (-70 mV, Na+/K+ ATPase 3 Na+ out / 2 K+ in)', 'Depolarization via voltage-gated Na+ influx', 'Saltatory conduction in myelinated axons'],
          commonTraps: ['Action potential is all-or-none; stimulus intensity is encoded by frequency of spikes, not amplitude of individual spike']
        }
      ]
    },
    {
      name: 'Cell Biology & Biomolecules',
      subject: 'Biology',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      topics: [
        {
          name: 'Cell Cycle & Cell Division (Mitosis / Meiosis)',
          yieldScore: 96,
          keyConcepts: ['Stages of Meiosis I Prophase: Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis', 'Crossing over occurs at Pachytene', 'Chiasmata visible at Diplotene'],
          commonTraps: ['Recombination nodules and crossing over occur in Pachytene; chiasmata dissolution begins in Diplotene']
        },
        {
          name: 'Cell Organelles & Endomembrane System',
          yieldScore: 91,
          keyConcepts: ['Mitochondria & Chloroplast semi-autonomous nature (70S ribosomes, circular DNA)', 'Golgi apparatus cis/trans polarity', 'Lysosomal acid hydrolases'],
          commonTraps: ['Peroxisomes and glyoxysomes are NOT part of the endomembrane system']
        }
      ]
    },
    {
      name: 'Plant Physiology',
      subject: 'Biology',
      yieldScore: 90,
      pastQuestionFrequency: 91,
      conceptImportance: 89,
      topics: [
        {
          name: 'Photosynthesis (C3, C4, CAM Pathways)',
          yieldScore: 94,
          keyConcepts: ['RuBisCO dual carboxylase/oxygenase activity in C3', 'Kranz anatomy & PEP carboxylase in C4', 'Non-cyclic photophosphorylation Z-scheme generating ATP and NADPH'],
          commonTraps: ['First stable product of C4 cycle is Oxaloacetic acid (4C), primary CO2 acceptor is PEP in mesophyll cells']
        },
        {
          name: 'Plant Hormones (Auxin, Cytokinin, Gibberellin, ABA, Ethylene)',
          yieldScore: 89,
          keyConcepts: ['Apical dominance caused by Auxin', 'Cytokinin delays senescence (Richmond-Lang effect)', 'ABA is stress hormone inducing stomatal closure'],
          commonTraps: ['Auxin promotes root initiation in cuttings, but inhibits elongation of primary root at high concentrations']
        }
      ]
    },
    {
      name: 'Ecology & Environment',
      subject: 'Biology',
      yieldScore: 88,
      pastQuestionFrequency: 89,
      conceptImportance: 87,
      topics: [
        {
          name: 'Ecosystem Dynamics & Ecological Pyramids',
          yieldScore: 91,
          keyConcepts: ['Pyramid of energy is ALWAYS upright', 'Inverted pyramid of biomass in aquatic ecosystem', '10% Lindeman energy transfer rule'],
          commonTraps: ['Pyramid of numbers in single large tree ecosystem with insects and birds is spindle-shaped or inverted']
        }
      ]
    }
  ],

  MAT: [
    {
      name: 'Numerical & Mathematical Reasoning',
      subject: 'MAT',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      topics: [
        {
          name: 'Advanced Sequences, Modular Cycles & Cryptarithms',
          yieldScore: 97,
          keyConcepts: ['Nested difference series', 'Modular calendar & clock cycles', 'Base arithmetic & cryptarithmetic deductions'],
          commonTraps: ['Missing alternating operations in geometric-arithmetic hybrid sequences']
        },
        {
          name: 'Permutations, Combinations & Probability Puzzles',
          yieldScore: 95,
          keyConcepts: ['Derangements and circular arrangements', 'Conditional Bayes probability in clinical diagnostic tests', 'Pigeonhole principle in discrete sets'],
          commonTraps: ['Overcounting arrangements with identical indistinguishable items', 'Confusing false positive rate with posterior probability']
        },
        {
          name: 'Work-Rate, Pipe Cisterns & Relative Speed Dynamics',
          yieldScore: 93,
          keyConcepts: ['Harmonic mean in round-trip velocities', 'Alternating work shifts with negative draining rates', 'Escalator and circular track meeting points'],
          commonTraps: ['Adding speeds directly without accounting for reference frames or distance fractions']
        }
      ]
    },
    {
      name: 'Logical Deduction & Analytical Reasoning',
      subject: 'MAT',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      topics: [
        {
          name: 'Multi-Premise Syllogisms & Venn Logic',
          yieldScore: 96,
          keyConcepts: ['"Some A are not B" negative particular deductions', 'Complementary pairs in "Either-Or" conclusions', 'Quantifiers (Few, Only, At least) in formal logic'],
          commonTraps: ['Assuming "Some A are B" implies "Some A are not B"', 'Treating possibility as definite truth']
        },
        {
          name: 'Complex Linear & Circular Seating Matrix',
          yieldScore: 94,
          keyConcepts: ['Facing inward vs outward alternating orientations', 'Multi-attribute matrix grids (Profession, City, Color)', 'Elimination through strict negative constraints'],
          commonTraps: ['Reversing immediate left/right when a subject faces away from center']
        },
        {
          name: 'Knights, Knaves & Truth-Teller Paradoxes',
          yieldScore: 92,
          keyConcepts: ['Self-referential truth tables', 'Bivalent logic contradiction proofs', 'Conditional statement contrapositives ($P \\implies Q \\equiv \\neg Q \\implies \\neg P$)'],
          commonTraps: ['Failing to check if a hypothesis creates an internal contradiction for the speaker itself']
        }
      ]
    },
    {
      name: 'Spatial, Visual & Abstract Reasoning',
      subject: 'MAT',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      topics: [
        {
          name: 'Cube Folding, Unfolding & Dice Dot Positions',
          yieldScore: 95,
          keyConcepts: ['Opposite face invariants in standard net unfolds (T-net, cross-net)', 'Chirality and face rotation orientation in 3D', 'Adjacent edge alignment after orthogonal folding'],
          commonTraps: ['Two faces separated by one face in a straight net are always opposite, not adjacent']
        },
        {
          name: 'Figure Matrices & Topological Transformations',
          yieldScore: 91,
          keyConcepts: ['XOR overlays in binary geometric patterns', 'Clockwise/counter-clockwise independent element rotations', 'Conservation of intersections and nodal topology'],
          commonTraps: ['Confusing reflection across diagonal axis with 90-degree planar rotation']
        }
      ]
    },
    {
      name: 'Relational, Direction & Data Sufficiency',
      subject: 'MAT',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      topics: [
        {
          name: 'Multi-Generational Blood Relations & Coded Pedigrees',
          yieldScore: 95,
          keyConcepts: ['Coded operator trees ($A + B$ means father, $A \\times B$ means sister)', 'Indirect generational shifts (paternal vs maternal uncles/aunts)', 'Gender ambiguity resolution'],
          commonTraps: ['Assuming gender based on name rather than stated relational operator']
        },
        {
          name: 'Vector Compass Displacements & Shadow Dynamics',
          yieldScore: 93,
          keyConcepts: ['Pythagorean coordinate vector sums ($(\\sum \\Delta x, \\sum \\Delta y)$)', 'Time-of-day solar azimuth shadow reversals (Morning sun in East casts shadow West)', 'Angular bearing turns (e.g. 135-degree clockwise from NW)'],
          commonTraps: ['Forgetting that at 12:00 noon on solar equator, shadow is negligible, and morning vs evening reverses shadow direction']
        }
      ]
    }
  ]
};

export const SUBJECT_MARK_DISTRIBUTION = {
  Biology: 80,
  Physics: 50,
  Chemistry: 50,
  MAT: 20
} as const;

export const TOTAL_EXAM_MARKS = 200;
export const TOTAL_EXAM_TIME_MINUTES = 180;
export const NEGATIVE_MARKING_PENALTY = 0.25;
export const CORRECT_MARK = 1.0;

