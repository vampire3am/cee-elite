import { Subject } from '@/types';

export interface ChapterInfo {
  name: string;
  subject: Subject;
  category?: string;
  yieldScore: number; // 0 - 100 based on CEE past paper trend weight
  pastQuestionFrequency: number;
  conceptImportance: number;
  weightageMarks?: number;
  topics: {
    name: string;
    yieldScore: number;
    keyConcepts: string[];
    commonTraps: string[];
  }[];
}

export const CEE_SYLLABUS: Record<Subject, ChapterInfo[]> = {
  Physics: [
    // Mechanics
    {
      name: 'Physical Quantities, Vectors & Dimensions',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 88,
      pastQuestionFrequency: 89,
      conceptImportance: 87,
      weightageMarks: 2,
      topics: [
        {
          name: 'Dimensional Analysis & Error Propagation',
          yieldScore: 90,
          keyConcepts: ['Principle of homogeneity', 'Percentage errors in power formulas', 'Dimensions of constant combinations ($G$, $h$, $\\mu_0$, $\\epsilon_0$)'],
          commonTraps: ['Adding relative errors directly instead of fractional error weights']
        },
        {
          name: 'Vector Algebra & Relative Velocity',
          yieldScore: 86,
          keyConcepts: ['Cross product vs dot product orthogonality', 'River-boat shortest path vs shortest time', 'Rain-man relative velocity vectors'],
          commonTraps: ['Confusing angle of rain with respect to ground vs with respect to moving person']
        }
      ]
    },
    {
      name: 'Kinematics: Rectilinear & Projectile Motion',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      weightageMarks: 3,
      topics: [
        {
          name: 'Projectile Motion & Trajectory Equations',
          yieldScore: 95,
          keyConcepts: ['Complementary projection angles with equal range', 'Velocity vector at peak elevation', 'Equation of trajectory in terms of horizontal range: $y = x \\tan\\theta(1 - x/R)$'],
          commonTraps: ['Forgetting that vertical velocity is zero at highest point, but horizontal velocity is non-zero ($u\\cos\\theta$)']
        },
        {
          name: 'Non-Uniform Acceleration & Motion Graphs',
          yieldScore: 89,
          keyConcepts: ['Slope of $v$-$t$ graph is acceleration', 'Area under $a$-$t$ graph is change in velocity', 'Stopping distance proportional to $u^2$'],
          commonTraps: ['Area under $v$-$t$ graph gives displacement, not total distance if direction reverses']
        }
      ]
    },
    {
      name: 'Laws of Motion & Friction',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Newton Laws, Connected Bodies & Pulley Systems',
          yieldScore: 96,
          keyConcepts: ['Constraint relations in movable pulleys', 'Apparent weight in accelerating elevator', 'Impulse-momentum theorem'],
          commonTraps: ['Tension in rope of Atwood machine is not simply $(m_1 - m_2)g$']
        },
        {
          name: 'Static, Limiting & Kinetic Friction',
          yieldScore: 92,
          keyConcepts: ['Angle of repose equals angle of friction', 'Two-block system friction threshold', 'Minimum pulling force at angle $\\theta = \\lambda$'],
          commonTraps: ['Static friction is a self-adjusting force up to $\\mu_s N$; it is not always equal to $\\mu_s N$']
        }
      ]
    },
    {
      name: 'Work, Energy & Power',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 3,
      topics: [
        {
          name: 'Work-Energy Theorem & Conservative Forces',
          yieldScore: 95,
          keyConcepts: ['Work done by conservative force is negative of potential energy change ($W_c = -\\Delta U$)', 'Variable force work as integral $\\int F\\,dx$', 'Power $P = \\vec{F} \\cdot \\vec{v}$'],
          commonTraps: ['Normal reaction and static friction can do zero work in rolling, but friction does negative work in slipping']
        },
        {
          name: 'Vertical Circular Motion & Collisions',
          yieldScore: 94,
          keyConcepts: ['Minimum speed at bottom for complete circle $\\sqrt{5gR}$', 'Tension difference at bottom and top is $6mg$', 'Elastic 1D collision velocity exchange for identical masses'],
          commonTraps: ['In inelastic collisions, kinetic energy is lost, but total momentum is always conserved in isolated systems']
        }
      ]
    },
    {
      name: 'Circular Motion & Banking of Roads',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 89,
      pastQuestionFrequency: 90,
      conceptImportance: 88,
      weightageMarks: 2,
      topics: [
        {
          name: 'Centripetal Force & Optimum Banking Angle',
          yieldScore: 91,
          keyConcepts: ['Ideal banking angle $\\tan\\theta = v^2/(rg)$', 'Maximum safe speed with friction on banked track', 'Conical pendulum time period $T = 2\\pi\\sqrt{(l\\cos\\theta)/g}$'],
          commonTraps: ['Centripetal force is not an extra independent force; it is provided by real components like tension or normal force']
        }
      ]
    },
    {
      name: 'Gravitation & Planetary Dynamics',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Variation of g with Altitude, Depth & Rotation',
          yieldScore: 96,
          keyConcepts: ['Acceleration due to gravity at depth $g_d = g(1 - d/R)$', 'Acceleration at small height $g_h \\approx g(1 - 2h/R)$', 'Centrifugal reduction at latitude $\\lambda$: $g\' = g - \\omega^2 R \\cos^2\\lambda$'],
          commonTraps: ['Using the approximation $1 - 2h/R$ when height $h$ is large ($h \\ge 0.1R$); must use $gR^2/(R+h)^2$ instead']
        },
        {
          name: 'Orbital Speed, Escape Velocity & Kepler Laws',
          yieldScore: 93,
          keyConcepts: ['Escape velocity $v_e = \\sqrt{2gR} = \\sqrt{2} v_o$', 'Total energy of satellite is negative: $E = -GMm/(2r)$', 'Areal velocity conservation from angular momentum conservation'],
          commonTraps: ['Binding energy is positive ($+GMm/(2r)$), while total mechanical energy is negative']
        }
      ]
    },
    {
      name: 'Rotational Dynamics & Moment of Inertia',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Moment of Inertia Theorems & Pure Rolling',
          yieldScore: 97,
          keyConcepts: ['Parallel and perpendicular axis theorems', 'Rolling acceleration on incline $a = \\frac{g\\sin\\theta}{1 + k^2/R^2}$', 'Conservation of angular momentum ($I_1\\omega_1 = I_2\\omega_2$)'],
          commonTraps: ['Applying perpendicular axis theorem to 3D bodies; it holds only for 2D planar laminas']
        }
      ]
    },
    {
      name: 'Elasticity & Hooke\'s Law',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 87,
      pastQuestionFrequency: 88,
      conceptImportance: 86,
      weightageMarks: 2,
      topics: [
        {
          name: 'Modulus of Elasticity & Strain Energy',
          yieldScore: 89,
          keyConcepts: ['Young\'s modulus $Y = \\frac{FL}{A\\Delta L}$', 'Elastic energy density $u = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain}$', 'Poisson\'s ratio theoretical vs practical limits'],
          commonTraps: ['Young\'s modulus is a material constant; it does not change when wire is cut in half or stretched']
        }
      ]
    },
    {
      name: 'Hydrostatics, Surface Tension & Viscosity',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 3,
      topics: [
        {
          name: 'Surface Tension, Excess Pressure & Capillarity',
          yieldScore: 96,
          keyConcepts: ['Excess pressure in soap bubble $4T/R$ vs water drop $2T/R$', 'Capillary rise $h = \\frac{2T\\cos\\theta}{r\\rho g}$', 'Work done in blowing bubble or coalescing droplets'],
          commonTraps: ['Soap bubble has two free surfaces ($4T/R$), whereas liquid drop in air has only one free surface ($2T/R$)']
        },
        {
          name: 'Terminal Velocity & Stokes Law',
          yieldScore: 91,
          keyConcepts: ['Viscous drag $F = 6\\pi\\eta r v$', 'Terminal velocity proportional to $r^2(\\rho - \\sigma)$', 'Poiseuille equation for capillary flow'],
          commonTraps: ['Forgetting buoyancy when calculating net downward driving force in viscous liquid']
        }
      ]
    },
    {
      name: 'Fluid Dynamics & Bernoulli\'s Principle',
      subject: 'Physics',
      category: 'Mechanics',
      yieldScore: 90,
      pastQuestionFrequency: 91,
      conceptImportance: 89,
      weightageMarks: 2,
      topics: [
        {
          name: 'Equation of Continuity & Bernoulli Applications',
          yieldScore: 92,
          keyConcepts: ['Torricelli\'s theorem velocity of efflux $v = \\sqrt{2gh}$', 'Venturimeter flow rate', 'Magnus effect and dynamic aerodynamic lift'],
          commonTraps: ['Bernoulli equation applies only to streamlined, non-viscous, incompressible fluids']
        }
      ]
    },

    // Heat & Thermodynamics
    {
      name: 'Thermometry & Thermal Expansion',
      subject: 'Physics',
      category: 'Heat & Thermodynamics',
      yieldScore: 88,
      pastQuestionFrequency: 89,
      conceptImportance: 87,
      weightageMarks: 2,
      topics: [
        {
          name: 'Faulty Thermometer & Expansion in Solids/Liquids',
          yieldScore: 90,
          keyConcepts: ['Temperature scale conversion $\\frac{T - LFP}{UFP - LFP}$', 'Apparent vs real expansion of liquids: $\\gamma_r = \\gamma_a + \\gamma_g$', 'Thermal stress in clamped rods: $F/A = Y\\alpha\\Delta\\theta$'],
          commonTraps: ['Confusing superficial expansion coefficient ($\beta = 2\alpha$) with cubical expansion ($\gamma = 3\alpha$)']
        }
      ]
    },
    {
      name: 'Calorimetry & Phase Transitions',
      subject: 'Physics',
      category: 'Heat & Thermodynamics',
      yieldScore: 91,
      pastQuestionFrequency: 92,
      conceptImportance: 90,
      weightageMarks: 2,
      topics: [
        {
          name: 'Principle of Mixtures & Latent Heat Calculations',
          yieldScore: 93,
          keyConcepts: ['Heat lost = Heat gained', 'Water equivalent of calorimeter $W = mc$', 'Ice-water-steam thermal equilibrium endpoint verification'],
          commonTraps: ['Assuming all ice melts without checking if available heat from steam/water is sufficient to overcome latent heat of fusion']
        }
      ]
    },
    {
      name: 'Kinetic Theory of Gases',
      subject: 'Physics',
      category: 'Heat & Thermodynamics',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'Gas Velocities & Equipartition of Energy',
          yieldScore: 95,
          keyConcepts: ['Root mean square speed $v_{\\text{rms}} = \\sqrt{3RT/M}$', 'Ratio $v_p : v_{\\text{avg}} : v_{\\text{rms}} = \\sqrt{2} : \\sqrt{8/\\pi} : \\sqrt{3}$', 'Internal energy $U = \\frac{f}{2}nRT$ and degrees of freedom'],
          commonTraps: ['Molecular mass $M$ must be in kilograms per mole in SI units, not grams']
        }
      ]
    },
    {
      name: 'Thermodynamics, First & Second Laws & Heat Engines',
      subject: 'Physics',
      category: 'Heat & Thermodynamics',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'First Law Processes ($dQ = dU + dW$) & Indicator Diagrams',
          yieldScore: 97,
          keyConcepts: ['Isothermal work $W = nRT\\ln(V_2/V_1)$ vs adiabatic work $W = \\frac{nR(T_1 - T_2)}{\\gamma - 1}$', 'Adiabatic slope is $\\gamma$ times steeper than isothermal slope', 'Molar heat capacities relation $C_p - C_v = R$'],
          commonTraps: ['Work done in cyclic process is area inside PV loop; clockwise is positive work, counter-clockwise is negative']
        },
        {
          name: 'Carnot Engine Efficiency & Refrigerator COP',
          yieldScore: 96,
          keyConcepts: ['Carnot efficiency $\\eta = 1 - T_2/T_1 = W/Q_1$', 'Coefficient of performance $\\beta = T_2/(T_1 - T_2)$', 'Kelvin-Planck and Clausius statements of Second Law'],
          commonTraps: ['Reservoir temperatures $T_1$ and $T_2$ must strictly be converted to Kelvin, never used in Celsius']
        }
      ]
    },
    {
      name: 'Heat Transfer (Conduction, Convection & Radiation)',
      subject: 'Physics',
      category: 'Heat & Thermodynamics',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      weightageMarks: 2,
      topics: [
        {
          name: 'Stefan-Boltzmann, Wien Displacement & Newton Cooling',
          yieldScore: 95,
          keyConcepts: ['Stefan law $E = \\sigma T^4$', 'Wien\'s displacement law $\\lambda_m T = b$', 'Newton\'s law of cooling differential approximation: $\\frac{T_1 - T_2}{t} = K\\left(\\frac{T_1 + T_2}{2} - T_0\\right)$'],
          commonTraps: ['In Stefan\'s law with surroundings, net radiation is $\\sigma(T^4 - T_0^4)$, not $\\sigma(T - T_0)^4$']
        }
      ]
    },

    // Waves & Optics
    {
      name: 'Simple Harmonic Motion & Oscillations',
      subject: 'Physics',
      category: 'Waves & Optics',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Kinematics & Energy of Simple Harmonic Oscillators',
          yieldScore: 96,
          keyConcepts: ['Velocity $v = \\omega\\sqrt{A^2 - x^2}$', 'Acceleration $a = -\\omega^2 x$', 'Simple pendulum time period and effective $g$ in accelerating frames', 'Spring-mass series vs parallel combinations'],
          commonTraps: ['Phase difference between displacement and velocity is $\\pi/2$; between displacement and acceleration is $\\pi$']
        }
      ]
    },
    {
      name: 'Wave Motion & Sound Waves',
      subject: 'Physics',
      category: 'Waves & Optics',
      yieldScore: 91,
      pastQuestionFrequency: 92,
      conceptImportance: 90,
      weightageMarks: 2,
      topics: [
        {
          name: 'Speed of Sound & Laplace Correction',
          yieldScore: 93,
          keyConcepts: ['Newton-Laplace formula $v = \\sqrt{\\gamma P/\\rho}$', 'Dependence on temperature $v \\propto \\sqrt{T}$, independent of pressure at constant temperature', 'Phase difference $\\Delta\\phi = \\frac{2\\pi}{\\lambda}\\Delta x$'],
          commonTraps: ['Assuming sound speed changes with atmospheric pressure at constant temperature; $\\rho$ and $P$ vary proportionally so $P/\\rho$ stays constant']
        }
      ]
    },
    {
      name: 'Doppler Effect, Beats & Resonance in Pipes',
      subject: 'Physics',
      category: 'Waves & Optics',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Organ Pipes, Harmonics & End Correction',
          yieldScore: 97,
          keyConcepts: ['Closed pipe odd harmonics only ($f_1, 3f_1, 5f_1$)', 'Open pipe all harmonics ($f_1, 2f_1, 3f_1$)', 'End correction $e = 0.6r$ for closed, $1.2r$ for open pipe'],
          commonTraps: ['Forgetting that third harmonic in closed pipe is the first overtone, not the third overtone']
        },
        {
          name: 'Doppler Effect in Sound',
          yieldScore: 96,
          keyConcepts: ['Apparent frequency $f\' = f\\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)$', 'Doppler shift when moving reflector/echo is involved', 'Wind velocity vector addition to medium speed $v$'],
          commonTraps: ['Numerator has observer motion sign, denominator has source motion sign']
        }
      ]
    },
    {
      name: 'Reflection & Refraction at Spherical Mirrors & Lenses',
      subject: 'Physics',
      category: 'Waves & Optics',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 3,
      topics: [
        {
          name: 'Snell Law, Real/Apparent Depth & Critical Angle',
          yieldScore: 95,
          keyConcepts: ['Total internal reflection condition $\\sin C = 1/\\mu$', 'Apparent depth $d\' = d/\\mu$', 'Apparent shift $\\Delta t = t(1 - 1/\\mu)$ through transparent slab'],
          commonTraps: ['TIR occurs only when light propagates from denser to rarer medium with angle exceeding critical angle']
        },
        {
          name: 'Lens Maker Formula & Thin Lens Combinations',
          yieldScore: 94,
          keyConcepts: ['Lens maker formula $\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$', 'Focal length change when immersed in liquid of refractive index $\\mu_l$', 'Power of combined lenses $P = P_1 + P_2 - d P_1 P_2$'],
          commonTraps: ['Sign convention for equiconvex lens: $R_1 > 0$ and $R_2 < 0$, making $\\frac{1}{R_1} - \\frac{1}{R_2} = \\frac{2}{R}$']
        }
      ]
    },
    {
      name: 'Prisms, Dispersion & Optical Defects',
      subject: 'Physics',
      category: 'Waves & Optics',
      yieldScore: 90,
      pastQuestionFrequency: 91,
      conceptImportance: 89,
      weightageMarks: 2,
      topics: [
        {
          name: 'Prism Formula & Minimum Deviation',
          yieldScore: 93,
          keyConcepts: ['Refractive index $\\mu = \\frac{\\sin((A + \\delta_m)/2)}{\\sin(A/2)}$', 'Thin prism deviation $\\delta = (\\mu - 1)A$', 'Dispersive power $\\omega = \\frac{\\delta_v - \\delta_r}{\\delta_y}$ and dispersion without deviation'],
          commonTraps: ['At minimum deviation, angle of incidence equals angle of emergence ($i = e$) and refracted ray is parallel to base']
        }
      ]
    },
    {
      name: 'Optical Instruments (Microscope, Telescope & Human Eye)',
      subject: 'Physics',
      category: 'Waves & Optics',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Compound Microscope & Astronomical Telescope',
          yieldScore: 96,
          keyConcepts: ['Microscope magnifying power at near point $M = -\\frac{v_o}{u_o}\\left(1 + \\frac{D}{f_e}\\right)$', 'Telescope in normal adjustment $M = -f_o/f_e$ and tube length $L = f_o + f_e$', 'Defects of vision: Myopia corrected with concave lens, Hypermetropia with convex lens'],
          commonTraps: ['Telescope magnifying power is ratio of focal lengths $f_o/f_e$, with objective focal length being much larger than eyepiece']
        }
      ]
    },
    {
      name: 'Wave Optics (Interference, Diffraction & Polarization)',
      subject: 'Physics',
      category: 'Waves & Optics',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Young Double Slit Experiment (YDSE) & Fringe Width',
          yieldScore: 98,
          keyConcepts: ['Fringe width $\\beta = \\frac{\\lambda D}{d}$', 'Fringe shift by thin transparent sheet $\\Delta x = \\frac{(\\mu - 1)t D}{d}$', 'Intensity formula $I = 4I_0 \\cos^2(\\phi/2)$'],
          commonTraps: ['Fringe width in liquid medium decreases by factor of refractive index $\\beta\' = \\beta/\\mu$']
        },
        {
          name: 'Single Slit Diffraction & Brewster Law Polarization',
          yieldScore: 94,
          keyConcepts: ['Central maximum angular width $2\\lambda/a$', 'Brewster\'s angle $\\tan i_p = \\mu$ and reflected/refracted ray orthogonality', 'Malus law $I = I_0 \\cos^2\\theta$'],
          commonTraps: ['Diffraction minima condition is $a\\sin\\theta = n\\lambda$, which resembles interference maxima formula']
        }
      ]
    },

    // Electricity & Magnetism
    {
      name: 'Electrostatics & Gauss\'s Theorem',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Coulomb Law, Electric Field & Gauss Applications',
          yieldScore: 97,
          keyConcepts: ['Electric field of charged conducting sphere ($E_{\\text{in}} = 0$, $E_{\\text{out}} = \\frac{Q}{4\\pi\\epsilon_0 r^2}$)', 'Infinite line charge field $E = \\frac{\\lambda}{2\\pi\\epsilon_0 r}$', 'Electric dipole potential and torque $\\vec{\\tau} = \\vec{p} \\times \\vec{E}$'],
          commonTraps: ['Electric field inside a charged conductor is zero in electrostatic equilibrium, but electric potential is constant and non-zero']
        }
      ]
    },
    {
      name: 'Capacitance & Dielectrics',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Parallel Plate Capacitor & Dielectric Insertion',
          yieldScore: 98,
          keyConcepts: ['Capacitance with dielectric slab $C = \\frac{\\epsilon_0 A}{d - t + t/K}$', 'Battery connected: potential $V$ constant, charge $Q$ increases', 'Battery disconnected: charge $Q$ constant, potential $V$ and stored energy $U$ decrease by $1/K$'],
          commonTraps: ['Forgetting whether battery was kept connected or disconnected during dielectric insertion']
        }
      ]
    },
    {
      name: 'Current Electricity & Resistance',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'Drift Velocity, Ohm Law & Temperature Coefficient',
          yieldScore: 95,
          keyConcepts: ['Current density $J = n e v_d$', 'Resistance variation with temperature $R_t = R_0(1 + \\alpha t)$', 'Stretching wire by factor $n$: resistance increases by $n^2$ at constant volume'],
          commonTraps: ['Stretching wire increases length and decreases cross-sectional area simultaneously, so $R \\propto l^2 \\propto 1/A^2$']
        }
      ]
    },
    {
      name: 'Electric Circuits (Kirchhoff\'s Laws & Potentiometer)',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Kirchhoff Laws, Wheatstone Bridge & Potentiometer',
          yieldScore: 98,
          keyConcepts: ['Null deflection in potentiometer draws zero current from test cell', 'Internal resistance measurement $r = R\\left(\\frac{l_1 - l_2}{l_2}\\right)$', 'Sensitivity increased by increasing potentiometer wire length or reducing series driving current'],
          commonTraps: ['Current in potentiometer wire itself is not zero at null point; only galvanometer branch current is zero']
        }
      ]
    },
    {
      name: 'Thermoelectric & Chemical Effects of Current',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 88,
      pastQuestionFrequency: 89,
      conceptImportance: 87,
      weightageMarks: 2,
      topics: [
        {
          name: 'Seebeck Effect, Neutral Temperature & Faraday Laws',
          yieldScore: 90,
          keyConcepts: ['Neutral temperature relation $T_n = (T_i + T_c)/2$', 'Inversion temperature', 'Faraday\'s laws of electrolysis $m = z I t$ and chemical equivalent mass ratio'],
          commonTraps: ['Neutral temperature depends solely on the nature of metals forming the thermocouple; it does not change with cold junction temperature']
        }
      ]
    },
    {
      name: 'Magnetic Effects of Current & Ampere\'s Law',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Biot-Savart Law, Circular Coils & Solenoids',
          yieldScore: 97,
          keyConcepts: ['Magnetic field at center of circular loop $B = \\frac{\\mu_0 I}{2R}$', 'Field on axis $B = \\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}}$', 'Ampere\'s circuital law $\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0 I_{\\text{enc}}$'],
          commonTraps: ['Forgetting factor of $\\pi$ difference between straight wire field ($\\frac{\\mu_0 I}{2\\pi r}$) and center of circular coil ($\\frac{\\mu_0 I}{2R}$)']
        },
        {
          name: 'Lorentz Force, Cyclotron & Galvanometer Conversion',
          yieldScore: 95,
          keyConcepts: ['Magnetic force $\\vec{F} = q(\\vec{v} \\times \\vec{B})$ does zero work because force is perpendicular to velocity', 'Ammeter conversion using small shunt in parallel: $S = \\frac{I_g G}{I - I_g}$', 'Voltmeter conversion using large series resistor: $R = \\frac{V}{I_g} - G$'],
          commonTraps: ['Ammeter is connected in series in a circuit, but its internal shunt is connected in parallel with galvanometer coil']
        }
      ]
    },
    {
      name: 'Magnetism & Magnetic Properties of Matter',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 90,
      pastQuestionFrequency: 91,
      conceptImportance: 89,
      weightageMarks: 2,
      topics: [
        {
          name: 'Magnetic Dipole Moment & Dia/Para/Ferromagnetism',
          yieldScore: 92,
          keyConcepts: ['Curie law $\\chi \\propto 1/T$ for paramagnets; diamagnetism independent of temperature', 'Bohr magneton $\\mu_B = \\frac{eh}{4\\pi m}$', 'Hysteresis loop area represents energy dissipated per cycle'],
          commonTraps: ['Diamagnetic susceptibility is small and negative; paramagnetic susceptibility is small and positive']
        }
      ]
    },
    {
      name: 'Electromagnetic Induction & Alternating Current (AC)',
      subject: 'Physics',
      category: 'Electricity & Magnetism',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Faraday-Lenz Law, Motional EMF & Self/Mutual Induction',
          yieldScore: 97,
          keyConcepts: ['Induced EMF $e = -\\frac{d\\Phi}{dt}$ and Lenz law conservation of energy', 'Motional EMF $e = Bvl$ in perpendicular magnetic field', 'Energy stored in inductor $U = \\frac{1}{2}LI^2$'],
          commonTraps: ['Induced charge $\\Delta q = \\frac{\\Delta\\Phi}{R}$ depends only on total flux change, not on rate of flux change']
        },
        {
          name: 'Series LCR Resonance, Power Factor & Transformer',
          yieldScore: 96,
          keyConcepts: ['Resonance frequency $\\omega_0 = 1/\\sqrt{LC}$', 'Impedance at resonance $Z = R$ (minimum), power factor $\\cos\\phi = 1$', 'Transformer voltage and turns ratio: $\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}$'],
          commonTraps: ['AC meters measure RMS values of current and voltage, never peak values']
        }
      ]
    },

    // Modern Physics
    {
      name: 'Photons, Photoelectric Effect & X-Rays',
      subject: 'Physics',
      category: 'Modern Physics',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 3,
      topics: [
        {
          name: 'Einstein Photoelectric Equation & Stopping Potential',
          yieldScore: 98,
          keyConcepts: ['Kinetic energy $K_{\\text{max}} = h\\nu - \\phi = e V_0$', 'Stopping potential depends on frequency, not light intensity', 'Saturation current is directly proportional to intensity'],
          commonTraps: ['Confusing frequency with intensity: increasing intensity increases photo-current, not kinetic energy of electrons']
        },
        {
          name: 'De Broglie Wavelength & X-Ray Duane-Hunt Limit',
          yieldScore: 95,
          keyConcepts: ['De Broglie wavelength for accelerated electron $\\lambda = \\frac{h}{\\sqrt{2mqV}} = \\frac{12.27}{\\sqrt{V}}\\text{ \\AA}$', 'Minimum cut-off X-ray wavelength $\\lambda_{\\text{min}} = \\frac{hc}{eV}$', 'Moseley\'s law $\\sqrt{\\nu} = a(Z - b)$'],
          commonTraps: ['Continuous X-ray minimum wavelength depends only on accelerating voltage, independent of target material']
        }
      ]
    },
    {
      name: 'Atomic Models, Nuclear Physics & Semiconductor Electronics',
      subject: 'Physics',
      category: 'Modern Physics',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Bohr Hydrogen Atom Energy Levels & Spectral Series',
          yieldScore: 98,
          keyConcepts: ['Energy levels $E_n = -13.6 Z^2 / n^2\\text{ eV}$', 'Radius $r_n \\propto n^2/Z$', 'Lyman (UV), Balmer (Visible), Paschen/Brackett/Pfund (IR) series transitions'],
          commonTraps: ['Shortest wavelength in a series corresponds to transition from $n=\\infty$, longest from the immediately adjacent shell']
        },
        {
          name: 'Nuclear Binding Energy, Half-Life & Radioactivity',
          yieldScore: 97,
          keyConcepts: ['Decay law $N = N_0 e^{-\\lambda t} = N_0 (1/2)^{t/T_{1/2}}$', 'Decay constant $\\lambda = \\frac{\\ln 2}{T_{1/2}} = \\frac{0.693}{T_{1/2}}$', 'Mass defect $\\Delta m$ and binding energy per nucleon curve peak at Iron-56'],
          commonTraps: ['Activity is proportional to number of active nuclei: $A = \\lambda N$; after $n$ half-lives, fraction remaining is $(1/2)^n$ while decayed is $1 - (1/2)^n$']
        },
        {
          name: 'Semiconductors, P-N Junction Diodes & Logic Gates',
          yieldScore: 95,
          keyConcepts: ['Forward vs reverse bias depletion layer width', 'Zener diode in reverse breakdown as voltage regulator', 'Truth tables of NAND, NOR (universal gates) and De Morgan theorems'],
          commonTraps: ['Zener diode is always operated in reverse bias breakdown to maintain constant output voltage']
        }
      ]
    }
  ],

  Chemistry: [
    // Physical Chemistry
    {
      name: 'Stoichiometry, Mole Concept & Concentration Terms',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Mole Calculations, Limiting Reagent & % Purity',
          yieldScore: 96,
          keyConcepts: ['Molar volume of ideal gas at STP = $22.4\\text{ L}$', 'Identifying limiting reagent by moles / stoichiometric coefficient ratio', 'Empirical vs molecular formulas'],
          commonTraps: ['Limiting reagent is not the reactant with least moles, but the one with least moles divided by its stoichiometric coefficient']
        },
        {
          name: 'Normality, Molarity, Molality & Parts Per Million',
          yieldScore: 93,
          keyConcepts: ['Relation $N = M \\times n\\text{-factor}$', 'Molality and mole fraction are independent of temperature', 'Dilution formula $M_1V_1 = M_2V_2$'],
          commonTraps: ['Molality uses mass of solvent in kg, not total mass of solution']
        }
      ]
    },
    {
      name: 'Atomic Structure & Quantum Mechanics',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'Quantum Numbers, Electronic Configurations & Orbitals',
          yieldScore: 95,
          keyConcepts: ['Aufbau principle, Pauli exclusion & Hund rule of maximum multiplicity', 'Radial and angular nodes count: $(n - l - 1)$ radial, $l$ angular', 'Exceptional configurations of $\\text{Cr}$ ($3d^5 4s^1$) and $\\text{Cu}$ ($3d^{10} 4s^1$)'],
          commonTraps: ['Total number of orbitals in $n$-th shell is $n^2$; maximum electrons is $2n^2$']
        }
      ]
    },
    {
      name: 'Chemical Bonding & Molecular Structure',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 3,
      topics: [
        {
          name: 'VSEPR Theory, Hybridization & Molecular Geometry',
          yieldScore: 98,
          keyConcepts: ['Steric number calculation: $\\frac{1}{2}(V + M - C + A)$', 'Shape of molecules with lone pairs: $\\text{XeF}_4$ (square planar), $\\text{SF}_4$ (see-saw), $\\text{ClF}_3$ (T-shaped)', 'Dipole moments and vector cancelation in symmetrical geometries'],
          commonTraps: ['Confusing electron pair geometry with actual molecular shape (e.g. $\\text{XeF}_4$ is octahedral electron geometry but square planar molecular shape)']
        },
        {
          name: 'Molecular Orbital Theory (MOT) & Hydrogen Bonding',
          yieldScore: 96,
          keyConcepts: ['Bond order $= \\frac{1}{2}(N_b - N_a)$', 'Paramagnetism of $\\text{O}_2$ (two unpaired electrons in $\\pi^* 2p$)', 'Intermolecular vs intramolecular H-bonding boiling point anomalies'],
          commonTraps: ['Nitrogen ($N_2$) and lighter diatomics follow $\\pi 2p_x = \\pi 2p_y < \\sigma 2p_z$ energy ordering due to $s$-$p$ mixing']
        }
      ]
    },
    {
      name: 'States of Matter (Gaseous & Liquid States)',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 90,
      pastQuestionFrequency: 91,
      conceptImportance: 89,
      weightageMarks: 2,
      topics: [
        {
          name: 'Ideal Gas Equation & Real Gas Van der Waals Constants',
          yieldScore: 92,
          keyConcepts: ['Graham\'s law of diffusion $r_1/r_2 = \\sqrt{M_2/M_1}$', 'Van der Waals equation $(P + a n^2/V^2)(V - nb) = nRT$', 'Significance of constant $a$ (intermolecular attraction) and $b$ (effective molecular volume)'],
          commonTraps: ['Rate of diffusion depends inversely on square root of molar mass, not directly']
        }
      ]
    },
    {
      name: 'Solid State Chemistry',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 89,
      pastQuestionFrequency: 90,
      conceptImportance: 88,
      weightageMarks: 2,
      topics: [
        {
          name: 'Crystal Lattices, Unit Cells & Defects',
          yieldScore: 91,
          keyConcepts: ['Effective atoms in SC (1), BCC (2), FCC (4)', 'Packing efficiency: FCC (74%), BCC (68%), SC (52%)', 'Schottky defect decreases density; Frenkel defect leaves density unchanged'],
          commonTraps: ['Frenkel defect is a dislocation of ion into interstitial site and does not change crystal density']
        }
      ]
    },
    {
      name: 'Solutions & Colligative Properties',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Raoult Law, Van\'t Hoff Factor & Colligative Equations',
          yieldScore: 97,
          keyConcepts: ['Van \'t Hoff factor $i = 1 + (n - 1)\\alpha$ for dissociation, $i = 1 - (1 - 1/n)\\beta$ for association', 'Osmotic pressure $\\pi = i C R T$', 'Elevation of boiling point $\\Delta T_b = i K_b m$ and depression of freezing point $\\Delta T_f = i K_f m$'],
          commonTraps: ['Neglecting the Van \'t Hoff factor $i$ for ionic salts like $\\text{NaCl}$ ($i \\approx 2$) or $\\text{CaCl}_2$ ($i \\approx 3$)']
        }
      ]
    },
    {
      name: 'Chemical Thermodynamics & Thermochemistry',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Enthalpy, Hess Law & Spontaneity ($\Delta G = \Delta H - T\Delta S$)',
          yieldScore: 96,
          keyConcepts: ['First Law in chemistry: $\\Delta U = q + w$ ($w = -P_{\\text{ext}}\\Delta V$)', 'Relation $\\Delta H = \\Delta U + \\Delta n_g RT$', 'Spontaneous reaction condition $\\Delta G < 0$ and equilibrium $\\Delta G^\\circ = -RT\\ln K$'],
          commonTraps: ['Signs: In IUPAC chemical thermodynamics, work done BY system is negative ($-P\\Delta V$)']
        }
      ]
    },
    {
      name: 'Chemical Equilibrium',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'Kp vs Kc & Le Chatelier\'s Principle',
          yieldScore: 95,
          keyConcepts: ['Relation $K_p = K_c (RT)^{\\Delta n_g}$', 'Le Chatelier principle: pressure increase shifts to fewer moles of gas', 'Inert gas addition at constant volume has no effect on equilibrium'],
          commonTraps: ['Catalyst increases rates of both forward and backward reactions equally; it does not shift the equilibrium position or change $K_c$']
        }
      ]
    },
    {
      name: 'Ionic Equilibrium: Acids, Bases, Buffers & Ksp',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 3,
      topics: [
        {
          name: 'pH Calculations, Buffer Solutions & Hydrolysis of Salts',
          yieldScore: 98,
          keyConcepts: ['Henderson-Hasselbalch equation $\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]}$', 'Salt hydrolysis pH formulas for weak acid / strong base, weak base / strong acid', 'Solubility product $K_{sp}$ and condition for precipitation ($Q > K_{sp}$)'],
          commonTraps: ['Common ion effect drastically suppresses ionization of weak acids/bases; when calculating pH of extremely dilute acid ($10^{-8}\\text{ M }\\text{HCl}$), water ionization ($10^{-7}$) cannot be neglected']
        }
      ]
    },
    {
      name: 'Redox Reactions & Oxidation States',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 91,
      pastQuestionFrequency: 92,
      conceptImportance: 90,
      weightageMarks: 2,
      topics: [
        {
          name: 'Oxidation Number Rules & Ion-Electron Balancing',
          yieldScore: 93,
          keyConcepts: ['Oxidation state calculation in special peroxides ($\\text{CrO}_5$, $\\text{H}_2\\text{SO}_5$)', 'Balancing redox in acidic vs alkaline medium', 'Disproportionation reactions ($n$-factor determination)'],
          commonTraps: ['In $\\text{CrO}_5$ (butterfly structure), chromium is in $+6$ oxidation state due to peroxo bonds, not $+10$']
        }
      ]
    },
    {
      name: 'Electrochemistry & Galvanic Cells',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Nernst Equation, Standard EMF & Gibbs Free Energy',
          yieldScore: 98,
          keyConcepts: ['Nernst equation $E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n}\\log Q$', 'Relation $\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}$', 'Kohlrausch law of independent migration of ions and molar conductivity $\\Lambda_m$'],
          commonTraps: ['Electrochemical cell potential $E^\\circ$ is an intensive property and does not multiply when doubling reaction stoichiometric coefficients']
        }
      ]
    },
    {
      name: 'Chemical Kinetics & Rate Laws',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Reaction Orders, Integrated Rate Laws & Arrhenius Equation',
          yieldScore: 97,
          keyConcepts: ['Zero order ($t_{1/2} \\propto [A]_0$) vs first order ($t_{1/2} = \\frac{0.693}{k}$ independent of initial concentration)', 'Arrhenius equation $k = A e^{-E_a/RT}$ and temperature coefficient', 'Units of rate constant $k$: $(\\text{mol/L})^{1-n} \\text{s}^{-1}$'],
          commonTraps: ['Molecularity cannot be zero or fractional, but order of reaction can be zero, fractional, or negative']
        }
      ]
    },
    {
      name: 'Surface Chemistry, Catalysis & Colloids',
      subject: 'Chemistry',
      category: 'Physical Chemistry',
      yieldScore: 89,
      pastQuestionFrequency: 90,
      conceptImportance: 88,
      weightageMarks: 2,
      topics: [
        {
          name: 'Freundlich Isotherm & Hardy-Schulze Rule',
          yieldScore: 91,
          keyConcepts: ['Physical vs chemical adsorption characteristics', 'Hardy-Schulze rule: coagulating power increases with ionic valence ($Al^{3+} > Ba^{2+} > Na^+$)', 'Tyndall effect, Brownian motion & gold number of protective colloids'],
          commonTraps: ['Chemical adsorption involves high activation energy and forms unimolecular layer; physical adsorption forms multimolecular layers']
        }
      ]
    },

    // Inorganic Chemistry
    {
      name: 'Periodic Classification & Periodic Properties of Elements',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'Ionization Enthalpy, Electron Gain & Electronegativity Trends',
          yieldScore: 95,
          keyConcepts: ['Anomalies: $IE_1$ of $\\text{N} > \\text{O}$ and $\\text{Be} > \\text{B}$ due to half/fully-filled subshells', 'Electron gain enthalpy of Chlorine is more negative than Fluorine', 'Lanthanoid contraction and covalent radius parity of $4d/5d$ pairs ($Zr/Hf$)'],
          commonTraps: ['Chlorine has highest electron gain enthalpy, but Fluorine has highest electronegativity']
        }
      ]
    },
    {
      name: 'Hydrogen, Hydrides & Water Chemistry',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 87,
      pastQuestionFrequency: 88,
      conceptImportance: 86,
      weightageMarks: 1,
      topics: [
        {
          name: 'Hydrogen Peroxide ($\text{H}_2\text{O}_2$), Hardness of Water & Heavy Water',
          yieldScore: 89,
          keyConcepts: ['Volume strength of $\\text{H}_2\\text{O}_2$: $\\text{Volume strength} = 11.2 \\times M = 5.6 \\times N$', 'Temporary hardness (bicarbonates) removed by boiling/Clark method', 'Permanent hardness removed by zeolite/permutit or calgon process'],
          commonTraps: ['Calgon is sodium hexametaphosphate $\\text{Na}_6\\text{P}_6\\text{O}_{18}$']
        }
      ]
    },
    {
      name: 's-Block Elements: Alkali & Alkaline Earth Metals',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 91,
      pastQuestionFrequency: 92,
      conceptImportance: 90,
      weightageMarks: 2,
      topics: [
        {
          name: 'Diagonal Relationships, Solubility of Salts & Flame Colors',
          yieldScore: 93,
          keyConcepts: ['Diagonal relationship of $\\text{Li}-\\text{Mg}$ and $\\text{Be}-\\text{Al}$', 'Thermal stability of carbonates increases down group', 'Solubility of sulfates decreases down Group 2 while hydroxides increase'],
          commonTraps: ['Beryllium and Magnesium do not impart characteristic color to Bunsen flame due to tightly bound electrons']
        }
      ]
    },
    {
      name: 'p-Block Elements: Boron & Carbon Families (Groups 13 & 14)',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      weightageMarks: 2,
      topics: [
        {
          name: 'Inert Pair Effect, Diborane & Silicones',
          yieldScore: 94,
          keyConcepts: ['Inert pair effect stabilizes $+1$ in $\\text{Tl}$ and $+2$ in $\\text{Pb}$', 'Diborane ($\\text{B}_2\\text{H}_6$) banana bonds ($3c-2e$ bonds)', 'Lewis acid strength of boron trihalides: $\\text{BI}_3 > \\text{BBr}_3 > \\text{BCl}_3 > \\text{BF}_3$ due to back-bonding'],
          commonTraps: ['$\\text{BF}_3$ is weakest Lewis acid among boron halides because $2p-2p$ back bonding from fluorine reduces electron deficiency on boron']
        }
      ]
    },
    {
      name: 'p-Block Elements: Nitrogen & Phosphorus Family (Group 15)',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Ammonia, Nitric Acid, Phosphine & Oxoacids',
          yieldScore: 97,
          keyConcepts: ['Haber process optimal conditions', 'Ostwald process for $\\text{HNO}_3$', 'Reducing nature of hypophosphorous acid $\\text{H}_3\\text{PO}_2$ with two $\\text{P}-\\text{H}$ bonds', 'Basicity of oxoacids: $\\text{H}_3\\text{PO}_4$ (tribasic), $\\text{H}_3\\text{PO}_3$ (dibasic), $\\text{H}_3\\text{PO}_2$ (monobasic)'],
          commonTraps: ['Basicity of phosphorus oxoacids equals number of $P-OH$ bonds, not total hydrogen atoms in molecule']
        }
      ]
    },
    {
      name: 'p-Block Elements: Oxygen & Sulphur Family (Group 16)',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 2,
      topics: [
        {
          name: 'Sulfuric Acid, Contact Process & Allotropes of Sulphur',
          yieldScore: 96,
          keyConcepts: ['Contact process $\\text{V}_2\\text{O}_5$ catalyst and oleum formation', 'Dehydrating action of concentrated $\\text{H}_2\\text{SO}_4$', 'Oxidizing power trend: $\\text{H}_2\\text{SO}_4 < \\text{HNO}_3$'],
          commonTraps: ['Adding water to concentrated $\\text{H}_2\\text{SO}_4$ is strongly exothermic and causes dangerous splattering; acid must always be slowly added to water']
        }
      ]
    },
    {
      name: 'p-Block Elements: Halogens & Noble Gases (Groups 17 & 18)',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Bleaching Powder, Interhalogens & Xenon Fluorides',
          yieldScore: 97,
          keyConcepts: ['Oxidizing power: $\\text{F}_2 > \\text{Cl}_2 > \\text{Br}_2 > \\text{I}_2$', 'Acid strength of oxoacids: $\\text{HClO}_4 > \\text{HClO}_3 > \\text{HClO}_2 > \\text{HClO}$', 'Xenon compounds hybridization and shapes: $\\text{XeF}_2$ (linear), $\\text{XeF}_4$ (square planar), $\\text{XeOF}_4$ (square pyramidal)'],
          commonTraps: ['Acidic strength of hydrogen halides increases down group: $\\text{HF} < \\text{HCl} < \\text{HBr} < \\text{HI}$ due to decreasing bond dissociation enthalpy']
        }
      ]
    },
    {
      name: 'd-Block & f-Block Elements: Transition Metals',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Transition Metal Properties, Potassium Dichromate & Permanganate',
          yieldScore: 96,
          keyConcepts: ['Magnetic moment $\\mu = \\sqrt{n(n+2)}\\text{ BM}$', 'Equivalent weight of $\\text{KMnO}_4$: Acidic ($M/5$), Neutral/weakly alkaline ($M/3$), Strongly basic ($M/1$)', 'Color of transition ions due to $d-d$ transitions vs charge transfer ($\\text{KMnO}_4$, $\\text{K}_2\\text{Cr}_2\\text{O}_7$)'],
          commonTraps: ['Intense purple color of $\\text{MnO}_4^-$ is due to ligand-to-metal charge transfer, not $d-d$ transition (as $Mn^{7+}$ has $d^0$ configuration)']
        }
      ]
    },
    {
      name: 'Coordination Chemistry & Complex Compounds',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Werner Theory, IUPAC Nomenclature & Isomerism',
          yieldScore: 97,
          keyConcepts: ['Primary valence (ionizable) vs secondary valence (coordination number)', 'Linkage, ionization, and coordination isomerism', 'Optical isomerism in $[Co(en)_3]^{3+}$ and cis-$[Co(en)_2Cl_2]^+$'],
          commonTraps: ['Trans-isomer of $[Co(en)_2Cl_2]^+$ has a plane of symmetry and is optically inactive, whereas cis-isomer is optically active']
        },
        {
          name: 'Crystal Field Theory (CFT) & Spectrochemical Series',
          yieldScore: 96,
          keyConcepts: ['Octahedral splitting $\\Delta_o$ into $t_{2g}$ and $e_g$', 'Strong field ligands ($\\text{CN}^-$, $\\text{CO}$) cause pairing (low spin)', 'Weak field ligands ($\\text{F}^-$, $\\text{Cl}^-$) form high spin complexes'],
          commonTraps: ['$\\text{CO}$ is the strongest field ligand in the spectrochemical series, causing maximum crystal field splitting']
        }
      ]
    },
    {
      name: 'Metallurgy & Extraction of Heavy Metals (Fe, Cu, Zn, Ag, Pb, Hg)',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 91,
      pastQuestionFrequency: 92,
      conceptImportance: 90,
      weightageMarks: 2,
      topics: [
        {
          name: 'Froth Flotation, Blast Furnace & Ellingham Diagrams',
          yieldScore: 93,
          keyConcepts: ['Froth flotation collectors (pine oil, xanthate) and depressants ($\\text{NaCN}$ in $\\text{ZnS}/\\text{PbS}$)', 'Blast furnace zones and reactions in iron extraction (hematite)', 'Self-reduction in copper (copper glance) and lead (galena) metallurgy'],
          commonTraps: ['Flux added in blast furnace for iron is limestone ($\\text{CaCO}_3$, basic flux) to remove acidic $\\text{SiO}_2$ gangue as slag ($\\text{CaSiO}_3$)']
        }
      ]
    },
    {
      name: 'Environmental Chemistry & Industrial Pollutants',
      subject: 'Chemistry',
      category: 'Inorganic Chemistry',
      yieldScore: 88,
      pastQuestionFrequency: 89,
      conceptImportance: 87,
      weightageMarks: 1,
      topics: [
        {
          name: 'Photochemical Smog, Acid Rain & Ozone Depletion',
          yieldScore: 90,
          keyConcepts: ['Classical smog (reducing, London) vs Photochemical smog (oxidizing, Los Angeles: $\\text{PAN}$, ozone, acrolein)', 'Ozone layer breakdown by chlorofluorocarbon (CFC) chlorine free radicals', 'Biochemical Oxygen Demand (BOD) as indicator of organic water pollution'],
          commonTraps: ['Photochemical smog is oxidizing in nature and contains ozone and PAN, whereas classical smog contains $\\text{SO}_2$ and is reducing']
        }
      ]
    },

    // Organic Chemistry
    {
      name: 'Fundamental Principles of Organic Chemistry & IUPAC Nomenclature',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'IUPAC Naming Rules & Functional Group Priorities',
          yieldScore: 95,
          keyConcepts: ['Priority order: Carboxylic acid > Sulfonic acid > Ester > Acid chloride > Amide > Nitrile > Aldehyde > Ketone > Alcohol > Amine', 'Numbering to give lowest locants to principal functional group', 'Polyfunctional molecule IUPAC suffixes vs prefixes'],
          commonTraps: ['Aldehydic carbon is included in principal chain as \'-al\' when carbon is part of chain, but \'-carbaldehyde\' when directly attached to ring']
        }
      ]
    },
    {
      name: 'Isomerism in Organic Compounds',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Stereoisomerism: Geometrical (Cis/Trans, E/Z) & Optical Isomerism',
          yieldScore: 97,
          keyConcepts: ['Chirality, enantiomers, diastereomers and meso compounds', '$R/S$ Cahn-Ingold-Prelog priority assignment', 'Number of optical isomers $2^n$ (unsymmetrical) vs symmetrical formulas with meso forms'],
          commonTraps: ['Meso compounds possess chiral centers but are optically inactive due to internal compensation (plane or center of symmetry)']
        }
      ]
    },
    {
      name: 'General Organic Chemistry & Reaction Mechanisms',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 98,
      pastQuestionFrequency: 99,
      conceptImportance: 97,
      weightageMarks: 4,
      topics: [
        {
          name: 'Electronic Effects (Inductive, Mesomeric, Hyperconjugation)',
          yieldScore: 99,
          keyConcepts: ['Carbocation stability: tertiary > secondary > primary with resonance/hyperconjugation priority', 'Acidity comparison of carboxylic acids and phenols based on conjugate base resonance stabilization', 'Aromaticity criteria: Huckel rule ($4n+2$ $\\pi$ electrons, planar cyclic conjugation)'],
          commonTraps: ['Mesomeric effect generally dominates over inductive effect, EXCEPT for halogens on benzene ring where $-I$ dominates for reactivity but $+M$ directs ortho/para']
        },
        {
          name: 'Substitution vs Elimination ($S_N1$, $S_N2$, $E1$, $E2$)',
          yieldScore: 98,
          keyConcepts: ['$S_N2$: Concerted backside attack, complete Walden inversion, polar aprotic solvent, substrate order $1^\\circ > 2^\\circ > 3^\\circ$', '$S_N1$: Carbocation intermediate, partial racemization, polar protic solvent, substrate order $3^\\circ > 2^\\circ > 1^\\circ$', 'Saytzeff vs Hoffmann elimination rule with bulky bases'],
          commonTraps: ['Polar aprotic solvents (acetone, DMSO, DMF) accelerate $S_N2$ by leaving nucleophile naked and unsolvated']
        }
      ]
    },
    {
      name: 'Hydrocarbons: Alkanes, Alkenes & Alkynes',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Electrophilic Addition, Markovnikov Rule & Ozonolysis',
          yieldScore: 96,
          keyConcepts: ['Markovnikov addition vs Kharasch peroxide effect (applies ONLY to $\\text{HBr}$, not $\\text{HCl}$ or $\\text{HI}$)', 'Reductive ozonolysis ($\\text{O}_3, \\text{Zn}/\\text{H}_2\\text{O}$) to determine alkene double bond location', 'Acidity of terminal alkynes ($\\text{sp}$ hybridized carbon electronegativity) forming metal acetylides'],
          commonTraps: ['Peroxide anti-Markovnikov effect fails for $\\text{HCl}$ (strong bond) and $\\text{HI}$ (endothermic radical addition step)']
        }
      ]
    },
    {
      name: 'Haloalkanes & Haloarenes (Alkyl & Aryl Halides)',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Finkelstein, Swarts, Wurtz Reactions & Aryl Halide Inertness',
          yieldScore: 97,
          keyConcepts: ['Finkelstein halogen exchange ($\\text{NaI}$ in acetone)', 'Low reactivity of chlorobenzene towards nucleophilic substitution due to partial double bond character from resonance', 'Grignard reagent preparation and reaction with active hydrogen'],
          commonTraps: ['Grignard reagents react violently with any source of acidic hydrogen (water, alcohol, amine) to form alkane']
        }
      ]
    },
    {
      name: 'Alcohols, Phenols & Ethers',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Lucas Test, Reimer-Tiemann & Kolbe Reactions',
          yieldScore: 98,
          keyConcepts: ['Lucas test turbidity: $3^\\circ$ alcohol (immediate), $2^\\circ$ ($5\\text{ min}$), $1^\\circ$ (no turbidity at room temp)', 'Kolbe synthesis: Phenol + $\\text{NaOH} + \\text{CO}_2 \\to$ Salicylic acid', 'Reimer-Tiemann reaction: Phenol + $\\text{CHCl}_3 + \\text{NaOH} \\to$ Salicylaldehyde via dichlorocarbene intermediate'],
          commonTraps: ['Ether cleavage by concentrated $\\text{HI}$: with $3^\\circ$ alkyl group, reaction goes by $S_N1$ forming tertiary iodide; with $1^\\circ$ or $2^\\circ$, it goes by $S_N2$ on smaller alkyl group']
        }
      ]
    },
    {
      name: 'Aldehydes & Ketones (Carbonyl Compounds)',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Nucleophilic Addition, Aldol Condensation & Cannizzaro Reaction',
          yieldScore: 99,
          keyConcepts: ['Aldol condensation requires $\\alpha$-hydrogen; Cannizzaro occurs in aldehydes lacking $\\alpha$-hydrogen (formaldehyde, benzaldehyde)', 'Fehling and Tollens silver mirror tests oxidize aldehydes, not ketones (except $\\alpha$-hydroxy ketones)', 'Iodoform test positive for compounds containing $\\text{CH}_3\\text{CO}-$ or $\\text{CH}_3\\text{CH(OH)}-$ unit'],
          commonTraps: ['Cannizzaro reaction involves disproportionation (self-redox) of two aldehyde molecules without $\\alpha$-hydrogen in concentrated alkali']
        }
      ]
    },
    {
      name: 'Carboxylic Acids & Acid Derivatives',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'Acidity Trends, HVZ Reaction & Esterification',
          yieldScore: 95,
          keyConcepts: ['Hell-Volhard-Zelinsky (HVZ) $\\alpha$-halogenation using red phosphorus and halogen', 'Nucleophilic acyl substitution reactivity: Acid chloride > Anhydride > Ester > Amide', 'Formic acid unique reducing properties (reduces Tollens and Fehling reagents unlike other carboxylic acids)'],
          commonTraps: ['Formic acid ($\text{HCOOH}$) possesses both aldehydic and carboxylic functional groups, so it gives positive silver mirror test']
        }
      ]
    },
    {
      name: 'Organic Nitrogen Compounds (Amines, Nitro & Diazonium Salts)',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Hinsberg Test, Carbylamine Test & Diazonium Coupling',
          yieldScore: 98,
          keyConcepts: ['Basicity of aliphatic amines in aqueous solution: $2^\\circ > 1^\\circ > 3^\\circ > \\text{NH}_3$ (for methyl), $2^\\circ > 3^\\circ > 1^\\circ$ (for ethyl)', 'Carbylamine test (isocyanide test) specific for primary amines', 'Diazotization of aniline at $0-5^\\circ\\text{C}$ to benzene diazonium chloride and Sandmeyer reaction'],
          commonTraps: ['Aromatic amines (aniline) are much weaker bases than aliphatic amines because nitrogen lone pair is delocalized into benzene ring']
        }
      ]
    },
    {
      name: 'Biomolecules (Carbohydrates, Amino Acids, Proteins & Nucleic Acids)',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 2,
      topics: [
        {
          name: 'Glucose Structure, Zwitterions & Peptide Bonds',
          yieldScore: 96,
          keyConcepts: ['Reducing vs non-reducing sugars (Sucrose is non-reducing because both anomeric carbons are linked)', 'Isoelectric point of amino acids and zwitterion structure', 'Primary, secondary ($\alpha$-helix, $\beta$-pleated), tertiary and quaternary protein structures'],
          commonTraps: ['Denaturation of proteins destroys secondary and tertiary structures, but leaves primary peptide sequence intact']
        }
      ]
    },
    {
      name: 'Polymers & Everyday Chemistry',
      subject: 'Chemistry',
      category: 'Organic Chemistry',
      yieldScore: 88,
      pastQuestionFrequency: 89,
      conceptImportance: 87,
      weightageMarks: 1,
      topics: [
        {
          name: 'Addition vs Condensation Polymers & Therapeutic Drugs',
          yieldScore: 90,
          keyConcepts: ['Nylon-6,6 (adipic acid + hexamethylenediamine), Dacron/Terylene, Bakelite', 'Natural rubber (cis-1,4-polyisoprene) vs Gutta-percha (trans)', 'Analgesics, antipyretics, antiseptics vs disinfectants'],
          commonTraps: ['Phenol is antiseptic at low concentration ($0.2\\%$) but disinfectant at higher concentration ($1\\%$)']
        }
      ]
    }
  ],

  Biology: [
    // Zoology
    {
      name: 'Origin of Life & Theories of Evolution (Darwinism & Human Origin)',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 3,
      topics: [
        {
          name: 'Urey-Miller Experiment, Homologous Organs & Natural Selection',
          yieldScore: 95,
          keyConcepts: ['Oparin-Haldane biochemical origin theory & Urey-Miller synthesis of amino acids ($\text{CH}_4 : \text{NH}_3 : \text{H}_2 = 2:1:2$)', 'Homologous organs indicate divergent evolution; analogous organs indicate convergent evolution', 'Hardy-Weinberg equilibrium conditions ($p^2 + 2pq + q^2 = 1$) and human ancestral milestones (Australopithecus, Homo erectus, Neanderthal, Cro-Magnon)'],
          commonTraps: ['Homology signifies common ancestry with divergent functions, while analogy indicates adaptation to similar niche without close relationship']
        }
      ]
    },
    {
      name: 'Animal Diversity I: Protozoa, Porifera & Coelenterata',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Protozoan Locomotion, Canal System & Polymorphism',
          yieldScore: 96,
          keyConcepts: ['Plasmodium vivax life cycle in man (schizogony) and female Anopheles mosquito (sporogony)', 'Porifera water canal systems (Ascon, Sycon, Leucon) and choanocytes (collar cells)', 'Cnidaria cnidoblasts, alternation of generations (metagenesis in Obelia) and coral reefs'],
          commonTraps: ['In Plasmodium, infective stage to humans is sporozoite; infective stage to mosquito is gametocyte']
        }
      ]
    },
    {
      name: 'Animal Diversity II: Platyhelminthes & Aschelminthes (Nematodes)',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 3,
      topics: [
        {
          name: 'Parasitic Helminths (Taenia, Fasciola, Ascaris & Wuchereria)',
          yieldScore: 95,
          keyConcepts: ['Taenia solium life cycle, cysticercus larva and pig as intermediate host', 'Fasciola hepatica larval stages: Miracidium > Sporocyst > Redia > Cercaria > Metacercaria', 'Ascaris lumbricoides juvenile rhabditiform migration and Wuchereria bancrofti elephantiasis transmitted by Culex mosquito'],
          commonTraps: ['Taenia lacks a digestive tract completely and absorbs digested nutrients through its body surface microtriches']
        }
      ]
    },
    {
      name: 'Animal Diversity III: Annelida, Arthropoda, Mollusca & Echinodermata',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 4,
      topics: [
        {
          name: 'True Coelom, Open/Closed Circulation & Larval Forms',
          yieldScore: 97,
          keyConcepts: ['Annelida metameric segmentation, nephridia and closed circulation', 'Arthropoda chitinous exoskeleton, open circulation with hemocoel, Malpighian tubules', 'Mollusca radula, mantle and torsion in Gastropoda', 'Echinodermata water vascular system, tube feet and bilateral larva with pentamerous radial adult'],
          commonTraps: ['Adult echinoderms have radial symmetry, but their larvae are bilaterally symmetrical']
        }
      ]
    },
    {
      name: 'Animal Diversity IV: Chordata (Pisces, Amphibia, Reptilia, Aves, Mammalia)',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 4,
      topics: [
        {
          name: 'Chordate Hallmarks, Aortic Arches & Vertebrate Adaptations',
          yieldScore: 98,
          keyConcepts: ['Notochord, dorsal hollow nerve cord and pharyngeal gill slits', 'Chondrichthyes (placoid scales, heterocercal tail, no operculum) vs Osteichthyes', 'Reptilian amniotic egg, Avian pneumatic bones and mammalian unique hallmarks (mammary glands, hair, 7 cervical vertebrae, left systemic arch)'],
          commonTraps: ['Mammals have a left aortic/systemic arch, while birds have a right aortic arch']
        }
      ]
    },
    {
      name: 'Functional Morphology & Life Cycle of Earthworm',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      weightageMarks: 2,
      topics: [
        {
          name: 'Pheretima posthuma Anatomy & Nephridial Types',
          yieldScore: 94,
          keyConcepts: ['Clitellum on segments 14, 15, 16', 'Septal (enteronephric), pharyngeal (enteronephric) and integumentary (exonephric) nephridia', 'Typhlosole in intestine for absorptive surface increase'],
          commonTraps: ['Spermathecae receive and store foreign sperm during copulation, located in segments 6, 7, 8, 9']
        }
      ]
    },
    {
      name: 'Functional Morphology & Organ Systems of Frog',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 91,
      pastQuestionFrequency: 92,
      conceptImportance: 90,
      weightageMarks: 2,
      topics: [
        {
          name: 'Rana tigrina Circulatory, Nervous & Reproductive Systems',
          yieldScore: 93,
          keyConcepts: ['Three-chambered heart with sinus venosus and conus arteriosus', 'Renal and hepatic portal systems', 'Urinogenital ducts and Bidder\'s canal in male frog testes'],
          commonTraps: ['Bidder\'s canal is present exclusively in the kidneys of male frogs, connecting testes to kidney for sperm conduction']
        }
      ]
    },
    {
      name: 'Animal Tissues & Histology',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Epithelial, Connective, Muscular & Nervous Tissues',
          yieldScore: 96,
          keyConcepts: ['Cell junctions: tight junctions, desmosomes, gap junctions', 'Haversian system (osteon) in compact mammalian bone', 'Smooth (involuntary, unstriated) vs skeletal (voluntary, syncytial) vs cardiac muscle (intercalated discs)'],
          commonTraps: ['Cartilage is avascular and receives nutrients by diffusion through perichondrium, explaining its slow healing']
        }
      ]
    },
    {
      name: 'Human Digestive System & Nutritional Physiology',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Gastrointestinal Secretions, Enzymes & Bile Action',
          yieldScore: 97,
          keyConcepts: ['Parietal (oxyntic) cells secrete $\\text{HCl}$ and Castle intrinsic factor', 'Bile contains no enzymes but emulsifies fats via bile salts (sodium taurocholate/glycocholate)', 'Pancreatic enzymes activation cascade initiated by enterokinase on trypsinogen'],
          commonTraps: ['Intrinsic factor from stomach parietal cells is essential for absorption of Vitamin $\\text{B}_{12}$ in the terminal ileum; its deficiency causes pernicious anemia']
        }
      ]
    },
    {
      name: 'Human Respiratory System & Gas Exchange Dynamics',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Pulmonary Volumes, Oxygen Dissociation Curve & Bohr Effect',
          yieldScore: 97,
          keyConcepts: ['Tidal volume ($500\\text{ mL}$), Vital capacity ($VC = TV + IRV + ERV$)', 'Bohr effect: curve shifts right with increased $\\text{pCO}_2$, $\\text{H}^+$, temperature, and $2,3\\text{-BPG}$', 'Carbon dioxide transport: $70\\%$ as bicarbonate ions via carbonic anhydrase in RBCs, with chloride shift (Hamburger phenomenon)'],
          commonTraps: ['Chloride shift moves $\\text{Cl}^-$ into erythrocytes from plasma at tissue capillaries to maintain electrical neutrality when $\\text{HCO}_3^-$ leaves']
        }
      ]
    },
    {
      name: 'Human Circulatory System, Blood Groups & Cardiac Dynamics',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Cardiac Cycle, Conducting System & Blood Clotting Cascade',
          yieldScore: 98,
          keyConcepts: ['SAN (pacemaker) > AVN > Bundle of His > Purkinje fibers', 'Cardiac cycle duration $0.8\\text{ s}$, stroke volume $70\\text{ mL}$, cardiac output $5\\text{ L/min}$', 'First heart sound ($S_1$, lub) due to AV valve closure; second ($S_2$, dub) due to semilunar valve closure', 'Erythroblastosis fetalis in $Rh^-$ mother carrying $Rh^+$ fetus'],
          commonTraps: ['First heart sound ($S_1$) is prolonged and low-pitched; second heart sound ($S_2$) is sharp, shorter, and high-pitched']
        }
      ]
    },
    {
      name: 'Human Excretory System & Renal Osmoregulation',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Nephron Physiology, Counter-Current Mechanism & RAAS',
          yieldScore: 98,
          keyConcepts: ['Glomerular filtration rate ($GFR = 125\\text{ mL/min}$ or $180\\text{ L/day}$)', 'Counter-current multiplier in Loop of Henle and vasa recta creates medullary osmotic gradient', 'RAAS pathway: Renin converts angiotensinogen to angiotensin I; aldosterone stimulates $\\text{Na}^+$ and water reabsorption in DCT'],
          commonTraps: ['Descending limb of Henle is permeable to water but impermeable to electrolytes; ascending limb is impermeable to water and actively transports electrolytes']
        }
      ]
    },
    {
      name: 'Human Muscular & Skeletal Locomotion Systems',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      weightageMarks: 2,
      topics: [
        {
          name: 'Sliding Filament Theory, Sarcomere & Human Skeleton',
          yieldScore: 94,
          keyConcepts: ['Sarcomere is structural unit between two Z-lines; during contraction, H-zone and I-band shorten, while A-band length remains constant', 'Calcium binds to troponin C, exposing active sites on actin for myosin cross-bridge binding', 'Axial skeleton (80 bones) vs appendicular skeleton (126 bones)'],
          commonTraps: ['A-band length never changes during muscle contraction because thick myosin filaments do not shorten']
        }
      ]
    },
    {
      name: 'Human Nervous System & Sense Organs (Eye & Ear)',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Action Potential, Synaptic Transmission & Brain Anatomy',
          yieldScore: 98,
          keyConcepts: ['Resting membrane potential ($-70\\text{ mV}$) maintained by $\\text{Na}^+/\\text{K}^+$ ATPase pump ($3\\text{ Na}^+$ out, $2\\text{ K}^+$ in)', 'Depolarization driven by rapid $\\text{Na}^+$ influx; repolarization by $\\text{K}^+$ efflux', 'Functions of hypothalamus (thermoregulation, hunger, thirst, pituitary hormone release), cerebellum (equilibrium and coordination), medulla (vital autonomic centers)'],
          commonTraps: ['Neurotransmitter release at chemical synapse is triggered by influx of extracellular Calcium ($Ca^{2+}$) into axon terminal']
        },
        {
          name: 'Structure & Physiology of Human Eye and Ear',
          yieldScore: 96,
          keyConcepts: ['Rods (rhodopsin, scotopic twilight vision) vs Cones (iodopsin, photopic color vision)', 'Fovea centralis contains densely packed cones and offers highest visual acuity', 'Organ of Corti on basilar membrane for hearing; Cristae ampullaris and Maculae (otoliths) for dynamic and static balance'],
          commonTraps: ['Semicircular canals detect angular/rotational acceleration; utricle and saccule detect linear acceleration and gravity']
        }
      ]
    },
    {
      name: 'Human Endocrine System & Hormonal Feedback Control',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Pituitary, Thyroid, Adrenal & Pancreatic Hormones',
          yieldScore: 98,
          keyConcepts: ['Posterior pituitary stores and releases oxytocin and vasopressin (ADH), synthesized in hypothalamus', 'Thyroid disorders: Graves disease (hyperthyroidism exophthalmos), Cretinism (congenital hypothyroidism), Myxedema', 'Adrenal cortex hormones: Glucocorticoids (cortisol), mineralocorticoids (aldosterone), and Addison disease from hyposecretion', 'Insulin (beta cells) lowers glucose; glucagon (alpha cells) raises glucose'],
          commonTraps: ['ADH acts on late DCT and collecting duct to increase aquaporin water channels; deficiency causes Diabetes Insipidus, NOT Diabetes Mellitus']
        }
      ]
    },
    {
      name: 'Human Reproductive System & Embryonic Development',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Spermatogenesis, Oogenesis, Menstrual Cycle & Cleavage',
          yieldScore: 98,
          keyConcepts: ['Sertoli cells provide nutrition; Leydig cells secrete testosterone under LH stimulation', 'Menstrual cycle: LH surge triggers ovulation on day 14; corpus luteum secretes progesterone', 'Fertilization occurs in ampulla of fallopian tube; blastocyst implants in endometrium ~6-7 days post-fertilization'],
          commonTraps: ['Corpus luteum degeneration causes abrupt drop in progesterone and estrogen, triggering menstrual shedding of stratum functionale']
        }
      ]
    },
    {
      name: 'Human Health, Immunology, Parasites & Diseases',
      subject: 'Biology',
      category: 'Zoology',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 4,
      topics: [
        {
          name: 'Immunity Types, Antibodies, AIDS & Cancer',
          yieldScore: 98,
          keyConcepts: ['Innate immunity barriers vs acquired humoral (B cells) and cell-mediated (T cells) immunity', 'Antibody structure ($H_2L_2$), immunoglobulin classes ($\text{IgG}$ crosses placenta, $\text{IgA}$ in colostrum, $\text{IgE}$ in allergies)', 'HIV infects CD4+ helper T lymphocytes, reducing cell-mediated immunity', 'Benign vs malignant tumors and metastasis'],
          commonTraps: ['Graft rejection following organ transplantation is primarily mediated by Cell-Mediated Immunity (T-lymphocytes), requiring immunosuppressants like cyclosporin A']
        }
      ]
    },

    // Botany
    {
      name: 'Plant Diversity I: Algae, Fungi & Lichens',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Algal Classes, Fungal Groups & Lichen Symbiosis',
          yieldScore: 96,
          keyConcepts: ['Chlorophyceae (chlorophyll a, b, starch), Phaeophyceae (fucoxanthin, laminarin/mannitol), Rhodophyceae (r-phycoerythrin, floridean starch)', 'Fungi classes: Phycomycetes, Ascomycetes (sac fungi, ascospores), Basidiomycetes (club fungi, basidiospores), Deuteromycetes (imperfect fungi lacking sexual stage)', 'Lichen mutualism (mycobiont + phycobiont) as sensitive air pollution indicators for $\\text{SO}_2$'],
          commonTraps: ['Red algae (Rhodophyceae) lack flagellated cells entirely throughout their life cycle']
        }
      ]
    },
    {
      name: 'Plant Diversity II: Bryophytes & Pteridophytes',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 3,
      topics: [
        {
          name: 'Amphibians of Plant Kingdom & Vascular Cryptogams',
          yieldScore: 95,
          keyConcepts: ['Bryophytes gametophyte is dominant free-living generation; sporophyte is dependent on gametophyte', 'Pteridophytes sporophyte is dominant independent generation with true vascular tissues (xylem and phloem)', 'Heterospory in Selaginella and Salvinia as precursor to seed habit'],
          commonTraps: ['Bryophytes require water for fertilization because flagellated antherozoids must swim to archegonium, which is why they are called amphibians of plant kingdom']
        }
      ]
    },
    {
      name: 'Plant Diversity III: Gymnosperms & Angiosperm Morphology (Root, Stem, Leaf)',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      weightageMarks: 3,
      topics: [
        {
          name: 'Naked Seeds in Gymnosperms & Vegetative Modifications',
          yieldScore: 94,
          keyConcepts: ['Gymnosperms (Pinus, Cycas) have naked ovules without ovary wall, anemophilous pollination, haploid endosperm formed before fertilization', 'Root modifications (pneumatophores in Rhizophora, prop roots in Banyan)', 'Stem modifications (rhizome, corm, tuber, phylloclade in Opuntia)'],
          commonTraps: ['Gymnosperm endosperm is haploid ($n$) and develops before fertilization, whereas angiosperm endosperm is triploid ($3n$) formed by double fertilization']
        }
      ]
    },
    {
      name: 'Inflorescence, Flower, Fruit & Seed Morphology',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Flower Parts, Placentation & Fruit Types',
          yieldScore: 96,
          keyConcepts: ['Placentation types: Marginal (Pea), Axile (Tomato, Lemon), Parietal (Mustard), Free central (Dianthus), Basal (Sunflower)', 'Ovary position: Hypogynous (superior), Perigynous (half-inferior), Epigynous (inferior)', 'True fruits (from ovary) vs false fruits (apple, strawberry involving thalamus)'],
          commonTraps: ['Mustard and Argemone have parietal placentation with false septum called replum']
        }
      ]
    },
    {
      name: 'Families of Angiosperms (Brassicaceae, Fabaceae, Solanaceae, Asteraceae, Poaceae, Liliaceae)',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 4,
      topics: [
        {
          name: 'Floral Formulas & Diagnostic Family Characteristics',
          yieldScore: 97,
          keyConcepts: ['Brassicaceae: Tetradynamous stamens ($2+4$), cruciform corolla', 'Fabaceae: Papilionaceous corolla (vexillary aestivation), diadelphous stamens ($[9]+1$)', 'Solanaceae: Epipetalous stamens, swollen axile placenta, obliquely placed ovary', 'Asteraceae: Capitulum/head inflorescence, syngenesious stamens, cypsela fruit with pappus', 'Poaceae/Liliaceae monocot floral patterns'],
          commonTraps: ['Solanaceae is characterized by an obliquely oriented ovary with swollen placenta and persistent calyx']
        }
      ]
    },
    {
      name: 'Plant Anatomy: Tissues, Meristems & Secondary Growth',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 3,
      topics: [
        {
          name: 'Vascular Bundles, Stomata & Cork Cambium',
          yieldScore: 95,
          keyConcepts: ['Dicot stem (conjoint, collateral, open, ring arrangement) vs monocot stem (closed, scattered, skull-shaped bundles)', 'Dicot root (radial, exarch, 2-4 bundles) vs monocot root (polyarch, large pith)', 'Secondary growth in dicot stems via vascular cambium and phellogen (cork cambium) forming annual rings'],
          commonTraps: ['Root xylem is always exarch (protoxylem towards periphery), while stem xylem is endarch (protoxylem towards center)']
        }
      ]
    },
    {
      name: 'Cell Biology: Organelles, Membrane Transport & Inclusions',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Endomembrane System, Mitochondria & Chloroplasts',
          yieldScore: 98,
          keyConcepts: ['Singer-Nicolson fluid mosaic model of plasma membrane', 'Endomembrane system includes ER, Golgi, lysosomes, vacuoles (excludes mitochondria, chloroplasts, peroxisomes)', 'Semi-autonomous nature of mitochondria and chloroplasts (circular DNA and 70S ribosomes)'],
          commonTraps: ['Peroxisomes and glyoxysomes are NOT part of the endomembrane system because their functions are not coordinated with ER/Golgi']
        }
      ]
    },
    {
      name: 'Cell Cycle, Mitosis & Meiotic Recombination',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Interphase Checkpoints & Prophase I Sub-Stages',
          yieldScore: 99,
          keyConcepts: ['S-phase: DNA replicates (amount doubles $2C \\to 4C$, but chromosome number remains $2n$)', 'Prophase I stages: Leptotene > Zygotene (synapsis, synaptonemal complex) > Pachytene (crossing over via recombinase) > Diplotene (chiasmata appearance, dissolution of complex) > Diakinesis (terminalization)', 'Anaphase I separates homologous chromosomes; Anaphase II separates sister chromatids'],
          commonTraps: ['Crossing over occurs in Pachytene stage, but chiasmata become visible during Diplotene as the synaptonemal complex dissolves']
        }
      ]
    },
    {
      name: 'Biomolecules, Enzyme Kinetics & Bio-energetics in Plants',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Enzyme Mechanisms, Inhibitors & Michaelis-Menten',
          yieldScore: 97,
          keyConcepts: ['Enzymes lower activation energy without altering $\\Delta G$', 'Competitive inhibition increases $K_m$ while leaving $V_{\\text{max}}$ unchanged (e.g. malonate on succinate dehydrogenase)', 'Non-competitive inhibition decreases $V_{\\text{max}}$ while leaving $K_m$ unchanged', 'Apoenzyme + Co-factor = Holoenzyme'],
          commonTraps: ['Competitive inhibitor can be overcome by increasing substrate concentration; non-competitive cannot']
        }
      ]
    },
    {
      name: 'Plant Water Relations: Osmosis, Transpiration & Ascent of Sap',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 3,
      topics: [
        {
          name: 'Water Potential ($\Psi_w = \Psi_s + \Psi_p$) & Cohesion-Tension Theory',
          yieldScore: 96,
          keyConcepts: ['Water potential of pure water at standard temperature and pressure is ZERO (maximum)', 'Water moves from higher (less negative) to lower (more negative) $\\Psi_w$', 'Dixon and Joly cohesion-tension-transpiration pull theory for ascent of sap', 'Guttation through hydathodes caused by root pressure'],
          commonTraps: ['Adding solute lowers water potential, making $\\Psi_s$ always negative; water potential $\\Psi_w$ is never positive under atmospheric pressure']
        }
      ]
    },
    {
      name: 'Mineral Nutrition & Biological Nitrogen Fixation',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 91,
      pastQuestionFrequency: 92,
      conceptImportance: 90,
      weightageMarks: 2,
      topics: [
        {
          name: 'Essential Elements, Deficiency Symptoms & Nitrogenase',
          yieldScore: 93,
          keyConcepts: ['Nitrogenase enzyme requires molybdenum-iron (Mo-Fe protein) and is oxygen-sensitive', 'Leghemoglobin acts as oxygen scavenger to protect nitrogenase in root nodules', 'Deficiency symptoms: Chlorosis (N, K, Mg, S, Fe, Mn, Zn, Mo), Necrosis (Ca, Mg, Cu, K)'],
          commonTraps: ['Nitrogenase is strictly anaerobic; leghemoglobin pink pigment creates an oxygen-free micro-environment for it']
        }
      ]
    },
    {
      name: 'Photosynthesis: Light & Dark Reactions, C3, C4 & CAM Cycles',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 98,
      pastQuestionFrequency: 99,
      conceptImportance: 97,
      weightageMarks: 4,
      topics: [
        {
          name: 'Non-Cyclic Photophosphorylation & Z-Scheme',
          yieldScore: 98,
          keyConcepts: ['PS II ($P_{680}$) photolysis of water ($2H_2O \\to 4H^+ + 4e^- + O_2$) assisted by $Mn^{2+}$ and $Cl^-$', 'Chemiosmotic ATP synthesis across thylakoid membrane driven by proton gradient into lumen', 'Cyclic photophosphorylation involves only PS I ($P_{700}$) producing ATP without NADPH or oxygen'],
          commonTraps: ['Water splitting complex is associated with PS II on inner surface (lumen side) of thylakoid membrane, not PS I']
        },
        {
          name: 'Calvin Cycle, Hatch-Slack Pathway & Photorespiration',
          yieldScore: 99,
          keyConcepts: ['RuBisCO is most abundant protein; acts as carboxylase and oxygenase', 'C4 pathway (Kranz anatomy in bundle sheath cells) avoids photorespiration; primary $CO_2$ acceptor is PEP carboxylase in mesophyll', 'Synthesis of one glucose in C3 requires $18\\text{ ATP} + 12\\text{ NADPH}$; in C4 requires $30\\text{ ATP} + 12\\text{ NADPH}$'],
          commonTraps: ['C4 plants have zero photorespiration because high $CO_2$ concentration is maintained around RuBisCO in bundle sheath cells']
        }
      ]
    },
    {
      name: 'Respiration in Plants: Glycolysis, TCA Cycle & Oxidative Phosphorylation',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'EMP Pathway, Krebs Cycle & Electron Transport System (ETS)',
          yieldScore: 98,
          keyConcepts: ['Glycolysis occurs in cytoplasm, yields net $2\\text{ ATP} + 2\\text{ NADH}$ per glucose, common to aerobic and anaerobic pathways', 'Krebs cycle in mitochondrial matrix; complete oxidation produces $2\\text{ ATP (GTP)} + 6\\text{ NADH} + 2\\text{ FADH}_2$ per glucose', 'Terminal electron acceptor in ETS complex IV (cytochrome c oxidase) is molecular oxygen ($O_2$), forming water'],
          commonTraps: ['Cyanide and carbon monoxide poison complex IV (cytochrome a-a3) of ETS, stopping cellular respiration instantly']
        }
      ]
    },
    {
      name: 'Plant Growth Regulators & Phytohormones (Auxin, GA, Cytokinin, Ethylene, ABA)',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 3,
      topics: [
        {
          name: 'Physiological Roles of Auxin, Gibberellin, Cytokinin, Ethylene & ABA',
          yieldScore: 97,
          keyConcepts: ['Auxin (IAA) promotes apical dominance, rooting of stem cuttings, parthenocarpy', 'Gibberellin causes bolting in rosette plants and alpha-amylase activation in germinating seeds', 'Cytokinin promotes cell division and delays senescence (Richmond-Lang effect)', 'Ethylene (gaseous) promotes fruit ripening; Abscisic acid (stress hormone) induces stomatal closure'],
          commonTraps: ['Synthetic auxin 2,4-D is widely used as a selective weedicide to kill broad-leaved dicot weeds without harming monocot crops']
        }
      ]
    },
    {
      name: 'Principles of Genetics: Mendelian Laws, Linkage & Mutations',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 98,
      pastQuestionFrequency: 99,
      conceptImportance: 97,
      weightageMarks: 4,
      topics: [
        {
          name: 'Mendelian Ratios, Incomplete Dominance & Chromosomal Linkage',
          yieldScore: 99,
          keyConcepts: ['Monohybrid test cross $1:1$, Dihybrid test cross $1:1:1:1$, Dihybrid phenotypic $9:3:3:1$', 'Incomplete dominance (Mirabilis jalapa $1:2:1$) and codominance (ABO blood groups)', 'Morgan\'s Drosophila linkage experiments: distance between genes proportional to recombination frequency', 'Sex-linked recessive traits (Hemophilia, Color blindness) showing criss-cross inheritance'],
          commonTraps: ['Test cross involves crossing an individual with dominant phenotype to the homozygous recessive parent, used to determine genotype']
        }
      ]
    },
    {
      name: 'Molecular Genetics: DNA Replication, Transcription, Translation & Gene Regulation',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 99,
      pastQuestionFrequency: 99,
      conceptImportance: 98,
      weightageMarks: 5,
      topics: [
        {
          name: 'Central Dogma, Genetic Code & Lac Operon',
          yieldScore: 99,
          keyConcepts: ['Meselson-Stahl experiment proved semi-conservative DNA replication using $^{15}N$', 'Genetic code features: degenerate, universal, non-overlapping, unambiguous, AUG start codon (methionine)', 'Lac operon regulation: in presence of lactose (allolactose inducer), repressor protein is inactivated, allowing RNA polymerase to transcribe lacZ ($\\beta$-galactosidase), lacY, lacA'],
          commonTraps: ['DNA polymerase synthesizes DNA exclusively in the $5\' \\to 3\'$ direction; lagging strand is synthesized discontinuously as Okazaki fragments']
        }
      ]
    },
    {
      name: 'Biotechnology, Genetic Engineering, Microbiology & Ecology',
      subject: 'Biology',
      category: 'Botany',
      yieldScore: 97,
      pastQuestionFrequency: 98,
      conceptImportance: 96,
      weightageMarks: 4,
      topics: [
        {
          name: 'Recombinant DNA Tools, PCR, Ecological Pyramids & Biodiversity',
          yieldScore: 98,
          keyConcepts: ['Restriction endonucleases recognize palindromic sequences and cut to produce sticky ends', 'Polymerase Chain Reaction (PCR): Denaturation ($94^\\circ\\text{C}$), Annealing ($54^\\circ\\text{C}$), Extension ($72^\\circ\\text{C}$) using Taq polymerase from Thermus aquaticus', 'Pyramid of energy is ALWAYS upright according to 10% law of Lindeman', 'In-situ (national parks, sanctuaries, biosphere reserves) vs ex-situ (zoological parks, botanical gardens, cryopreservation) conservation'],
          commonTraps: ['Pyramid of biomass in an aquatic ecosystem (ocean/pond) is inverted because phytoplankton have small standing crop with rapid turnover']
        }
      ]
    }
  ],

  MAT: [
    {
      name: 'Numerical & Mathematical Reasoning',
      subject: 'MAT',
      category: 'Quantitative',
      yieldScore: 96,
      pastQuestionFrequency: 97,
      conceptImportance: 95,
      weightageMarks: 3,
      topics: [
        {
          name: 'Bayes Medical Diagnostics & Positive Predictive Value (PPV)',
          yieldScore: 98,
          keyConcepts: ['Posterior probability given prevalence, sensitivity, and specificity', 'Base rate fallacy in medical screening populations', 'Positive Predictive Value $PPV = \\frac{TP}{TP + FP}$'],
          commonTraps: ['Neglecting base disease prevalence in healthy population screenings']
        },
        {
          name: 'Work-Rate, Pipe Flows & Percentage Ratios',
          yieldScore: 94,
          keyConcepts: ['Harmonic work sum $\\frac{1}{T} = \\frac{1}{A} + \\frac{1}{B} - \\frac{1}{C}$', 'Mixture replacement formulas', 'Compound growth doubling time approximation ($72/r$)'],
          commonTraps: ['Adding individual rates directly instead of reciprocating time durations']
        }
      ]
    },
    {
      name: 'Logical Deduction & Syllogism',
      subject: 'MAT',
      category: 'Logical',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 2,
      topics: [
        {
          name: 'Categorical Syllogisms & Venn Quantifiers',
          yieldScore: 97,
          keyConcepts: ['Universal affirmative (All A are B), particular negative (Some A are not B)', 'Valid deductive syllogism chains', 'Either-or complementary pairs (Some + No)'],
          commonTraps: ['Treating "Some A are B" as meaning "Some A are NOT B" by unwarranted assumption']
        },
        {
          name: 'Knights, Knaves & Truth-Teller Paradoxes',
          yieldScore: 93,
          keyConcepts: ['Self-referential truth tables', 'Bivalent logic contradiction proofs', 'Conditional statement contrapositives ($P \\implies Q \\equiv \\neg Q \\implies \\neg P$)'],
          commonTraps: ['Failing to test if an initial truth hypothesis creates an internal contradiction for the speaker']
        }
      ]
    },
    {
      name: 'Analytical & Critical Thinking',
      subject: 'MAT',
      category: 'Logical',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 2,
      topics: [
        {
          name: 'Statement Assumptions, Arguments & Course of Action',
          yieldScore: 96,
          keyConcepts: ['Implicit assumptions vs explicit restatements', 'Strong vs weak arguments in policy evaluations', 'Cause and effect relationships vs correlation'],
          commonTraps: ['Selecting an option that is factually true in real life but is not an assumption made by the given statement']
        }
      ]
    },
    {
      name: 'Spatial, Visual & Abstract Pattern Reasoning',
      subject: 'MAT',
      category: 'Visual & Spatial',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 2,
      topics: [
        {
          name: 'Cube Folding, Unfolding & Dice Dot Positions',
          yieldScore: 97,
          keyConcepts: ['Opposite face invariants in standard net unfolds (T-net, cross-net)', 'Chirality and face rotation orientation in 3D', 'Adjacent edge alignment after orthogonal folding'],
          commonTraps: ['Two faces separated by one face in a straight net are always opposite, never adjacent']
        },
        {
          name: 'Figure Matrices & Topological Transformations',
          yieldScore: 93,
          keyConcepts: ['XOR overlays in binary geometric patterns', 'Clockwise/counter-clockwise independent element rotations', 'Conservation of intersections and nodal topology'],
          commonTraps: ['Confusing reflection across diagonal axis with 90-degree planar rotation']
        }
      ]
    },
    {
      name: 'Series Completion (Number, Alphabet, Alpha-Numeric & Figures)',
      subject: 'MAT',
      category: 'Logical',
      yieldScore: 93,
      pastQuestionFrequency: 94,
      conceptImportance: 92,
      weightageMarks: 2,
      topics: [
        {
          name: 'Multi-Tier Differences & Prime/Fibonacci Progressions',
          yieldScore: 95,
          keyConcepts: ['Second-order polynomial difference series', 'Interleaved alternating arithmetic/geometric series', 'Alphabet positional values (A=1, Z=26) and reverse values (A=26, Z=1)'],
          commonTraps: ['Looking for single common difference when sequence is an interleaved dual series']
        }
      ]
    },
    {
      name: 'Analogy & Classification (Verbal & Non-Verbal)',
      subject: 'MAT',
      category: 'Logical',
      yieldScore: 92,
      pastQuestionFrequency: 93,
      conceptImportance: 91,
      weightageMarks: 2,
      topics: [
        {
          name: 'Semantic, Functional & Spatial Analogies',
          yieldScore: 94,
          keyConcepts: ['Instrument to measured parameter pairings (Sphygmomanometer : Blood Pressure)', 'Part to whole and cause to symptom hierarchies', 'Odd-man-out based on symmetry, prime factorizations or biological taxonomy'],
          commonTraps: ['Reversing the antecedent and consequent order in analogy pairings']
        }
      ]
    },
    {
      name: 'Coding-Decoding & Symbolic Operations',
      subject: 'MAT',
      category: 'Logical',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 2,
      topics: [
        {
          name: 'Substitution Ciphers & Operator Reassignments',
          yieldScore: 96,
          keyConcepts: ['Shift ciphers with variable index offsets', 'Coded equations with BODMAS precedence remapping', 'Fictitious language word-code intersection matrices'],
          commonTraps: ['Applying remapped operators without strictly following BODMAS order of operations']
        }
      ]
    },
    {
      name: 'Blood Relations & Family Tree Deduction',
      subject: 'MAT',
      category: 'Relational',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 2,
      topics: [
        {
          name: 'Multi-Generational Pedigrees & Coded Relations',
          yieldScore: 97,
          keyConcepts: ['Coded operator trees ($A + B$ means father, $A \\times B$ means sister)', 'Indirect generational shifts (paternal vs maternal uncles/aunts)', 'Gender ambiguity resolution'],
          commonTraps: ['Assuming gender based on name rather than stated relational operator']
        }
      ]
    },
    {
      name: 'Direction & Distance Sense Navigation',
      subject: 'MAT',
      category: 'Spatial',
      yieldScore: 94,
      pastQuestionFrequency: 95,
      conceptImportance: 93,
      weightageMarks: 2,
      topics: [
        {
          name: 'Vector Compass Displacements & Shadow Dynamics',
          yieldScore: 96,
          keyConcepts: ['Pythagorean coordinate vector sums ($(\\sum \\Delta x, \\sum \\Delta y)$)', 'Time-of-day solar azimuth shadow reversals (Morning sun in East casts shadow West)', 'Angular bearing turns (e.g. 135-degree clockwise from NW)'],
          commonTraps: ['At 12:00 noon, solar shadow is shortest or absent, and morning vs evening reverses shadow direction']
        }
      ]
    },
    {
      name: 'Data Sufficiency, Venn Diagrams & Statement Assumptions',
      subject: 'MAT',
      category: 'Analytical',
      yieldScore: 95,
      pastQuestionFrequency: 96,
      conceptImportance: 94,
      weightageMarks: 2,
      topics: [
        {
          name: 'Two/Three Variable Data Sufficiency & Set Overlays',
          yieldScore: 97,
          keyConcepts: ['Evaluating Statement 1 alone vs Statement 2 alone vs Both combined', 'Three-set inclusion-exclusion: $|A \\cup B \\cup C|$ formula', 'Never calculating actual numerical answer if sufficiency is already established'],
          commonTraps: ['Solving for the exact number when question only asks whether the given data is sufficient to determine it']
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

export function getChaptersForSubject(subject: Subject): ChapterInfo[] {
  return CEE_SYLLABUS[subject] || [];
}

export function getAllChapters(): ChapterInfo[] {
  return Object.values(CEE_SYLLABUS).flat();
}

export function findChapterByName(chapterName: string): ChapterInfo | undefined {
  const norm = chapterName.trim().toLowerCase();
  return getAllChapters().find(c => {
    const cNorm = c.name.trim().toLowerCase();
    return cNorm === norm || cNorm.includes(norm) || norm.includes(cNorm);
  });
}
