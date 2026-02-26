export interface KnowledgeEntry {
  specialty: string
  title: string
  content: string
}

export const CLINICAL_KNOWLEDGE: KnowledgeEntry[] = [

  // ─── TRAUMA ──────────────────────────────────────────────────────────────────

  {
    specialty: 'trauma',
    title: 'Understanding Trauma Responses',
    content: `Trauma responses are the nervous system's survival adaptations — not character flaws. The three most common are fight (anger, aggression), flight (avoidance, panic), and freeze (numbness, dissociation). A fourth, fawn, involves people-pleasing to avoid threat. These responses are automatic and unconscious. When working with a client, normalise these responses explicitly: "Your nervous system is doing exactly what it was designed to do." Avoid language that implies the client should simply 'get over it' or 'move on'.`
  },
  {
    specialty: 'trauma',
    title: 'Window of Tolerance',
    content: `The Window of Tolerance (Siegel, 1999) describes the optimal arousal zone where a person can process experiences without becoming overwhelmed. Hyperarousal (above the window) involves anxiety, panic, flashbacks, and hypervigilance. Hypoarousal (below the window) involves numbness, dissociation, and shutdown. Effective trauma therapy gently expands this window over time. Practical strategies to return to the window include grounding techniques (5-4-3-2-1 senses), slow diaphragmatic breathing, and orienting exercises (naming what you can see in the room).`
  },
  {
    specialty: 'trauma',
    title: 'Trauma-Informed Communication',
    content: `Key principles of trauma-informed communication: (1) Safety first — create psychological safety before exploring difficult material. (2) Trustworthiness — be transparent, consistent, and follow through. (3) Choice and control — always offer options, never pressure. (4) Collaboration — "we work on this together." (5) Empowerment — focus on strengths, not deficits. When a client becomes distressed, slow down. Return to grounding before proceeding. Never push a client past their window of tolerance. Pacing is more important than progress.`
  },
  {
    specialty: 'trauma',
    title: 'EMDR and Trauma Processing',
    content: `Eye Movement Desensitisation and Reprocessing (EMDR) is an evidence-based therapy for PTSD. It works by having clients briefly recall traumatic memories while engaging in bilateral stimulation (typically eye movements). This is thought to enable the brain to reprocess the memory so it no longer triggers the same emotional response. EMDR follows an 8-phase protocol: history-taking, preparation, assessment, desensitisation, installation, body scan, closure, and re-evaluation. While AI cannot deliver EMDR, therapists can explain its principles and encourage clients to seek a qualified EMDR practitioner.`
  },
  {
    specialty: 'trauma',
    title: 'Complex PTSD (C-PTSD)',
    content: `Complex PTSD arises from repeated or prolonged trauma, especially in childhood or in contexts where escape was impossible (e.g. abuse, neglect, captivity). Unlike PTSD, C-PTSD also involves: persistent difficulties with emotional regulation, distorted self-perception (deep shame, worthlessness), relationship difficulties (trust, attachment), and altered consciousness (dissociation, depersonalisation). Pete Walker's work on the 4Fs (fight, flight, freeze, fawn) and inner child work are particularly relevant. Healing is slower and requires addressing attachment wounds alongside trauma processing.`
  },
  {
    specialty: 'trauma',
    title: 'Grounding Techniques for Trauma',
    content: `Grounding brings a dissociated or hyperaroused client back to the present moment. Techniques include: 5-4-3-2-1 (name 5 things you can see, 4 you can hear, 3 you can touch, 2 you can smell, 1 you can taste); box breathing (inhale 4 counts, hold 4, exhale 4, hold 4); the 'safe place' visualisation (guide the client to mentally visit a calm, safe space with all senses); cold water on wrists or face; and feet-on-floor (pressing feet firmly into the floor and noticing the pressure). Always check in after grounding: "How are you feeling now on a scale of 0-10?"`
  },

  // ─── GRIEF ───────────────────────────────────────────────────────────────────

  {
    specialty: 'grief',
    title: "Worden's Four Tasks of Mourning",
    content: `William Worden proposed that grief involves four active tasks (not passive stages): (1) Accepting the reality of the loss — moving from intellectual to emotional acceptance. (2) Processing the pain of grief — allowing and working through the pain rather than avoiding it. (3) Adjusting to a world without the deceased — external adjustments (practical roles), internal adjustments (identity), and spiritual adjustments (meaning-making). (4) Finding an enduring connection with the deceased while embarking on a new life — maintaining a healthy ongoing bond while reinvesting in living. This model emphasises agency — the bereaved person actively works through grief rather than simply experiencing it passively.`
  },
  {
    specialty: 'grief',
    title: 'Types of Grief',
    content: `Grief takes many forms beyond bereavement. Disenfranchised grief occurs when a loss is not socially recognised (e.g. miscarriage, pet death, loss of a relationship that others didn't know about). Anticipatory grief occurs before a loss (caring for a terminally ill person). Complicated grief (Prolonged Grief Disorder) involves intense grief persisting beyond 12 months, with significant functional impairment. Ambiguous grief involves losses without closure (missing persons, estrangement). Each type requires different support. Normalise all forms of grief — there is no hierarchy of loss.`
  },
  {
    specialty: 'grief',
    title: 'Continuing Bonds Theory',
    content: `Continuing Bonds Theory (Klass, Silverman & Nickman, 1996) challenged the idea that healthy grieving means 'letting go'. Instead, research shows that maintaining a transformed but ongoing relationship with the deceased is a healthy and natural part of grief. This might involve: talking to the deceased; keeping meaningful objects; incorporating their values into your life; sensing their presence. Therapeutically, this approach validates that love doesn't end with death. Help clients find ways to honour and carry their loved one with them as they move forward.`
  },
  {
    specialty: 'grief',
    title: 'The Dual Process Model of Grief',
    content: `The Dual Process Model (Stroebe & Schut) describes grief as oscillating between two orientations: loss-orientation (confronting the grief, yearning for the deceased, processing the pain) and restoration-orientation (attending to life changes, taking a break from grief, adjusting to new roles and identity). Healthy grieving involves moving between both — not staying stuck in either. Encourage clients that it is healthy and necessary to take breaks from grief, to laugh, and to engage with life. Oscillation is adaptive, not avoidance.`
  },
  {
    specialty: 'grief',
    title: 'Supporting Someone Through Grief',
    content: `The most important thing in grief support is presence, not problem-solving. Avoid: minimising ("at least they lived a long life"), comparing ("I know how you feel"), rushing ("you should be over this by now"), silver-lining ("everything happens for a reason"). Instead: listen without agenda, validate feelings, say the deceased's name, acknowledge how hard it is, follow the bereaved person's lead. Grief has no timeline. Anniversaries, milestones, and sensory triggers can reactivate grief even years later — this is normal, not regression.`
  },

  // ─── CBT ─────────────────────────────────────────────────────────────────────

  {
    specialty: 'cbt',
    title: 'The ABC Model',
    content: `The ABC model is the foundation of CBT: (A) Activating Event — the situation that triggered the response. (B) Beliefs — the thoughts and interpretations about the event. (C) Consequences — the emotional and behavioural outcomes. CBT proposes that it is not the event itself (A) but our beliefs about it (B) that determine how we feel and act (C). Therefore, by identifying and challenging unhelpful beliefs, we can change our emotional responses. Ask clients: "What was going through your mind at that moment?" rather than "How did that make you feel?" — the belief is the lever for change.`
  },
  {
    specialty: 'cbt',
    title: 'Common Cognitive Distortions',
    content: `Cognitive distortions are systematic patterns of biased thinking identified by Aaron Beck and David Burns. Key ones: All-or-nothing thinking (black and white, no middle ground). Catastrophising (assuming the worst will happen). Mind-reading (assuming you know what others think). Fortune-telling (predicting negative outcomes). Emotional reasoning (I feel it, therefore it must be true). Should statements (rigid rules that generate guilt/shame). Personalisation (blaming yourself for things outside your control). Overgeneralisation (one event means everything). Mental filter (focusing only on negatives). When helping clients, name the distortion without shame: "It sounds like that might be a bit of catastrophising — let's test it."`
  },
  {
    specialty: 'cbt',
    title: 'Thought Records',
    content: `A thought record (or thought diary) is a core CBT tool for challenging automatic negative thoughts. Standard columns: (1) Situation — what happened, when, where. (2) Emotions — what you felt, intensity 0-100%. (3) Automatic thought — what went through your mind. (4) Evidence FOR the thought. (5) Evidence AGAINST the thought. (6) Balanced thought — a more realistic alternative. (7) Re-rate emotions after the balanced thought. Guide clients to look for evidence as a scientist would — objectively, considering all the data. The goal is not forced positivity but realistic thinking. Even a shift from 80% to 60% belief in a negative thought is meaningful progress.`
  },
  {
    specialty: 'cbt',
    title: 'Behavioural Activation',
    content: `Behavioural activation is particularly effective for depression. The principle: depression reduces activity, which reduces positive experiences, which deepens depression (the vicious cycle). Breaking the cycle means increasing activity before motivation returns — motivation follows action, not the other way around. Steps: (1) Map current activities and mood (activity diary). (2) Identify avoided activities that previously gave pleasure or achievement. (3) Schedule small, manageable activities (start with 5-minute goals). (4) Rate mood before and after. (5) Gradually increase. Key principle: "Act your way into a new way of thinking, not think your way into a new way of acting."`
  },
  {
    specialty: 'cbt',
    title: 'Socratic Questioning in CBT',
    content: `Socratic questioning guides clients to examine and challenge their own beliefs through a series of probing questions rather than direct challenge. Useful questions: "What is the evidence for and against this thought?" "What would you say to a friend who had this thought?" "What is the worst that could realistically happen? And if it did, could you cope?" "Are there any other ways of looking at this situation?" "What are you basing this prediction on?" "How many times has this actually happened versus how many times you feared it would?" The goal is collaborative discovery — the client arrives at a more balanced view themselves, making it far more durable than being told what to think.`
  },
  {
    specialty: 'cbt',
    title: 'Exposure Therapy Principles',
    content: `Exposure therapy is the gold standard for anxiety disorders. The principle: anxiety decreases naturally if you stay in a feared situation long enough without escape (habituation). Avoidance maintains anxiety by preventing habituation. Approach: (1) Build an anxiety hierarchy (list feared situations from least to most anxiety-provoking, rate each 0-100). (2) Start with the least feared item. (3) Stay in the situation until anxiety reduces by at least 50%. (4) Repeat until habituation occurs before moving up. Important: safety behaviours (subtle avoidance like checking, carrying medication 'just in case') must be dropped — they prevent full habituation. Always do exposure collaboratively and at the client's pace.`
  },

  // ─── ANXIETY ─────────────────────────────────────────────────────────────────

  {
    specialty: 'anxiety',
    title: 'The Anxiety Cycle',
    content: `Anxiety follows a self-perpetuating cycle: perceived threat → physical symptoms (heart racing, shallow breathing, tension) → anxious thoughts ("something is wrong, I can't cope") → avoidance behaviours → short-term relief but increased anxiety long-term. The key insight is that anxiety itself is not dangerous — it is uncomfortable but not harmful. The physical symptoms are the fight-or-flight response doing exactly what it is designed to do. Psychoeducation about this cycle is often immediately relieving. Ask clients: "What does your anxiety feel like physically?" Then validate: "That's your nervous system's alarm system working. It has misread the threat level — let's recalibrate it."`
  },
  {
    specialty: 'anxiety',
    title: 'Nervous System Regulation Techniques',
    content: `The autonomic nervous system has two branches: sympathetic (fight-or-flight, activating) and parasympathetic (rest-and-digest, calming). Anxiety is sympathetic overdrive. Techniques to activate the parasympathetic system: (1) Physiological sigh — double inhale through nose, long slow exhale through mouth. Research shows a single physiological sigh immediately reduces heart rate. (2) Diaphragmatic breathing — belly rises on inhale, falls on exhale, exhale longer than inhale. (3) Cold water — splashing cold water on face activates the diving reflex, slowing heart rate. (4) Vagal toning — humming, gargling, cold showers. (5) Progressive muscle relaxation — tense and release each muscle group systematically.`
  },
  {
    specialty: 'anxiety',
    title: 'Generalised Anxiety Disorder (GAD)',
    content: `GAD is characterised by persistent, excessive worry about multiple domains (health, finances, relationships, work) that is difficult to control, present most days for at least 6 months, and accompanied by at least 3 of: restlessness, fatigue, concentration difficulties, irritability, muscle tension, sleep disturbance. The key feature is intolerance of uncertainty — people with GAD struggle to tolerate not knowing. Treatment focuses on: challenging worry thoughts, building uncertainty tolerance (gradual exposure to uncertain situations without seeking reassurance), worry postponement (scheduled 'worry time'), and distinguishing productive from unproductive worry. Ask: "Is this worry helping you solve a problem or just looping?"`
  },
  {
    specialty: 'anxiety',
    title: 'Panic Attacks and Panic Disorder',
    content: `A panic attack is a sudden surge of intense fear that peaks within minutes, with physical symptoms including palpitations, sweating, trembling, shortness of breath, chest pain, dizziness, derealization, and fear of dying or going mad. Panic disorder involves recurrent attacks plus persistent concern about future attacks and avoidance. The maintenance mechanism is the misinterpretation of physical sensations as dangerous. Intervention: (1) Psychoeducation — panic cannot harm you; it always peaks and passes. (2) Decatastrophising physical symptoms. (3) Interoceptive exposure — deliberately inducing sensations (spinning, hyperventilating) to prove they are safe. (4) Breathing retraining. Never reassure excessively — this maintains health anxiety.`
  },
  {
    specialty: 'anxiety',
    title: 'Worry Postponement and Scheduled Worry Time',
    content: `Worry postponement is a structured technique for GAD: when a worry arises, rather than engaging with it immediately, the client notes it down and postpones engaging with it until a designated 'worry period' (e.g. 15 minutes at 5pm). During the worry period, the client reviews their list. Often, worries feel less pressing by then. This technique breaks the pattern of constant worry by demonstrating that worries can be deferred without catastrophe. It also consolidates worry into a defined period rather than allowing it to pervade the whole day. Combine with: distinguishing current-moment problems (actionable) from hypothetical worries (not actionable right now).`
  },

  // ─── DEPRESSION ──────────────────────────────────────────────────────────────

  {
    specialty: 'depression',
    title: 'Understanding Depression',
    content: `Depression is not weakness, laziness, or sadness. It is a complex condition involving changes in brain chemistry, thought patterns, behaviour, and physiology. Core symptoms: persistent low mood, loss of interest or pleasure (anhedonia), fatigue, sleep changes, appetite changes, concentration difficulties, feelings of worthlessness or guilt, and in severe cases, suicidal ideation. The PHQ-9 is a validated 9-item screening tool. Key insight for clients: depression distorts thinking — it filters for negatives and filters out positives. The thoughts feel true but they are symptoms, not facts. Recovery is possible; most people do recover with appropriate support.`
  },
  {
    specialty: 'depression',
    title: 'The Depression Maintenance Cycle',
    content: `Depression maintains itself through interconnected cycles: low mood → reduced activity → reduced positive experience → more negative thinking → lower mood. Sleep disruption exacerbates all of these. Social withdrawal removes the social contact that could buffer mood. Self-critical thinking intensifies shame. The key intervention point is behaviour — activity change precedes mood change, not the other way around. Identify the smallest possible step (get dressed, walk to the end of the road, send one text). Celebrate micro-achievements. Use an activity and mood diary to build the evidence that activity and mood are connected.`
  },
  {
    specialty: 'depression',
    title: 'Self-Compassion in Depression',
    content: `Kristin Neff's self-compassion framework is highly applicable to depression. Three components: (1) Self-kindness — treating yourself with the same care you would offer a good friend. (2) Common humanity — recognising that suffering is a universal human experience, not a personal failing. (3) Mindfulness — holding difficult feelings in balanced awareness, neither suppressing nor over-identifying. A core intervention: ask the client "What would you say to a close friend who was feeling exactly what you're feeling right now?" Then ask why they deserve less kindness than that friend would. Self-compassion reduces shame and self-attack, which are major depression-maintaining factors.`
  },
  {
    specialty: 'depression',
    title: 'Sleep Hygiene and Depression',
    content: `Sleep and depression are bidirectionally linked — depression disrupts sleep, and poor sleep deepens depression. Key sleep hygiene principles: consistent sleep and wake times (even weekends), limiting time in bed to actual sleep time (sleep restriction therapy), keeping the bedroom cool and dark, no screens for 60 minutes before bed, avoiding caffeine after 2pm, no napping, getting natural light in the morning (resets circadian rhythm). Importantly, lying in bed awake reinforces the association between bed and wakefulness. Encourage clients to only go to bed when sleepy, and if awake for more than 20 minutes, to get up and do something calm until sleepy.`
  },
  {
    specialty: 'depression',
    title: 'Meaning and Values in Depression Treatment',
    content: `ACT (Acceptance and Commitment Therapy) and logotherapy (Viktor Frankl) offer complementary approaches to depression by focusing on values and meaning rather than symptom reduction alone. Key questions: "What matters most to you?" "What kind of person do you want to be?" "What would you be doing if you weren't depressed?" Then connect small daily actions to those values. This provides intrinsic motivation that doesn't depend on feeling good first. Even in severe depression, small value-aligned actions (calling a friend because you value connection; going for a walk because you value health) can create a sense of agency and purpose.`
  },

  // ─── RELATIONSHIPS ───────────────────────────────────────────────────────────

  {
    specialty: 'relationships',
    title: "Gottman's Four Horsemen",
    content: `John Gottman's research identified four communication patterns that strongly predict relationship breakdown: (1) Criticism — attacking the person's character rather than their behaviour ("You're so selfish" vs "I felt hurt when you..."). (2) Contempt — superiority, mockery, eye-rolling; the single greatest predictor of divorce. (3) Defensiveness — deflecting responsibility, counter-attacking. (4) Stonewalling — emotional withdrawal, shutting down. Each has an antidote: (1) Gentle start-up — describe your feelings and needs without blame. (2) Build a culture of appreciation and respect. (3) Take responsibility for your part. (4) Self-soothe and return to the conversation.`
  },
  {
    specialty: 'relationships',
    title: 'Attachment Theory in Adult Relationships',
    content: `Bowlby and Ainsworth's attachment theory explains adult relationship patterns through early attachment experiences. Four adult attachment styles: (1) Secure — comfortable with intimacy and autonomy, able to use partner as a safe base. (2) Anxious (preoccupied) — fears abandonment, hypervigilant to relationship threats, reassurance-seeking. (3) Avoidant (dismissing) — uncomfortable with closeness, values independence, suppresses attachment needs. (4) Disorganised (fearful-avoidant) — wants and fears closeness simultaneously, often linked to trauma. Understanding your own and your partner's attachment style is the first step to changing unhelpful patterns. Attachment styles are not destiny — earned security is possible through consistent, responsive relationships.`
  },
  {
    specialty: 'relationships',
    title: 'Nonviolent Communication (NVC)',
    content: `Marshall Rosenberg's Nonviolent Communication framework transforms conflict by focusing on observations, feelings, needs, and requests. The structure: (1) Observation — "When I see/hear..." (specific, objective, no evaluation). (2) Feeling — "I feel..." (genuine emotion, not interpretation). (3) Need — "Because I need..." (universal human need, not a demand). (4) Request — "Would you be willing to...?" (specific, positive action, genuinely a request not a demand). Example: "When you check your phone during dinner [observation], I feel disconnected [feeling], because I need us to have time together [need]. Would you be willing to keep your phone in your pocket during dinner? [request]" This structure dramatically reduces defensiveness.`
  },
  {
    specialty: 'relationships',
    title: 'Healthy Boundaries',
    content: `Boundaries are not walls — they are the limits and expectations we set to protect our own wellbeing while remaining in relationship. Types: physical (personal space, touch), emotional (not responsible for others' feelings), time and energy (what you commit to), material (possessions, money), digital (contact expectations). Signs of poor boundaries: feeling responsible for others' emotions, inability to say no, resentment from over-giving, feeling controlled or controlling. Establishing a boundary: state it clearly, simply, without extensive justification ("I'm not available to take calls after 9pm"). A boundary is not about controlling the other person — it is about what you will do. Expect pushback when new boundaries are set — this is normal.`
  },
  {
    specialty: 'relationships',
    title: 'Repair After Conflict',
    content: `Research shows it is not the absence of conflict but the ability to repair after conflict that characterises healthy relationships (Gottman). Repair attempts are any gesture that interrupts escalating negativity — humour, touching, saying "I need a break", "I'm sorry", "I was wrong". Key repair principles: (1) Take a 20-minute physiological break when flooded (heart rate above 100bpm) — this is biological, not weakness. (2) Return to the conversation when calm. (3) Soft start-up — begin with "I feel" not "You always." (4) Genuine acknowledgement of your contribution. (5) Move toward understanding rather than winning. Relationships that have high repair rates are more resilient than those that avoid conflict entirely.`
  },

  // ─── GENERAL (applies to all specialties) ────────────────────────────────────

  {
    specialty: 'general',
    title: 'Active Listening Techniques',
    content: `Active listening is the foundation of all therapeutic relationships. Techniques: (1) Reflection — mirror back the emotional content: "It sounds like you're feeling overwhelmed." (2) Paraphrasing — restate in your own words to check understanding. (3) Summarising — periodically pull together the key themes. (4) Validation — acknowledge that the person's feelings make sense: "Of course you feel that way given what you've been through." (5) Open questions — "Tell me more about that" rather than yes/no questions. (6) Comfortable silence — allow space for the person to think. (7) Avoid jumping to solutions — ask "Would it be helpful to explore some options, or do you mostly need to be heard right now?"`
  },
  {
    specialty: 'general',
    title: 'Psychoeducation as a Therapeutic Tool',
    content: `Psychoeducation — providing clients with information about their condition and its treatment — is itself therapeutic. It reduces shame ("I'm not broken, this is a recognised condition"), increases agency ("I can understand what is happening and do something about it"), improves treatment adherence, and facilitates informed consent. When providing psychoeducation: (1) Check what the client already knows. (2) Ask how much they want to know. (3) Use simple, jargon-free language. (4) Relate information to their specific experience. (5) Check understanding. (6) Provide written resources to complement verbal information. Normalisation is particularly powerful: "Many people who have been through what you have feel exactly this way."`
  },
  {
    specialty: 'general',
    title: 'Motivational Interviewing Principles',
    content: `Motivational Interviewing (Miller & Rollnick) helps clients resolve ambivalence about change. Core principles (OARS): (1) Open questions — invite exploration rather than yes/no. (2) Affirmations — acknowledge strengths and efforts. (3) Reflections — mirror back what you hear. (4) Summaries — consolidate what has been discussed. The spirit of MI: collaboration (not confrontation), evocation (drawing out the client's own motivation), and autonomy (the client, not the therapist, is responsible for change). Avoid the 'righting reflex' — the urge to tell people what to do. Instead: "What are the reasons why you might want to make this change?" "On a scale of 1-10, how important is this change to you? Why did you pick that number and not lower?"`
  },
  {
    specialty: 'general',
    title: 'Setting Realistic Therapeutic Goals',
    content: `Effective therapeutic goals are SMART: Specific (not "feel better" but "reduce panic attacks from daily to twice weekly"), Measurable (a clear way to know progress), Achievable (realistic given current circumstances), Relevant (meaningful to the client, not just the therapist), and Time-bound (a review point). Collaboratively set goals at the start: "What would need to be different for you to feel that our conversations had been helpful?" Review goals regularly. Celebrate progress, however small. If goals are not being met, explore barriers collaboratively rather than assuming client resistance. Sometimes goals need to change as understanding deepens.`
  },

  // ─── PSYCHOANALYSIS ──────────────────────────────────────────────────────────

  {
    specialty: 'psychoanalysis',
    title: 'Free Association',
    content: `Free association is the fundamental technique of psychoanalysis, introduced by Freud as a replacement for hypnosis. The patient is instructed to say everything that enters their mind — every thought, image, feeling, memory — without censorship, selection, or logical ordering. The rule is simple but psychologically difficult: nothing is too trivial, too embarrassing, or too irrelevant to say. The analyst listens not for the surface content but for the gaps, hesitations, sudden changes of subject, repetitions, and charged words that betray the influence of unconscious material. The instruction: "Say everything that comes to mind, even if it seems absurd, shameful, or unrelated." What the patient cannot say is as important as what they do say.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'The Unconscious Mind',
    content: `For Freud, the unconscious is not merely forgotten material but actively repressed content — wishes, memories, and conflicts that are too threatening to be held in conscious awareness. The unconscious operates according to the pleasure principle (seeking gratification regardless of reality), primary process thinking (condensation, displacement, symbolic representation), and has no sense of time or contradiction. It makes itself known through dreams, parapraxes (slips of the tongue), symptoms, and the distortions of free association. The analytic task is to make the unconscious conscious — not through intellectual explanation but through the patient's own felt experience of recognition: "Yes — that is it." Insight without emotional resonance is intellectualisation, not analysis.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'The Structural Model: Id, Ego, Superego',
    content: `Freud's structural model divides the mind into three agencies. The id is the reservoir of drives — the raw, primitive, pleasure-seeking force demanding immediate gratification, operating entirely in the unconscious. The ego develops from the id through contact with reality; it mediates between the id's demands, the superego's prohibitions, and external reality. The ego operates the reality principle and employs defence mechanisms to manage anxiety. The superego is the internalized voice of parental authority and social norms — generating guilt when its standards are violated, shame when the ideal self is not met. Much psychological suffering arises from conflict between these agencies. The goal of analysis is not to eliminate the superego but to make it less tyrannical; not to eliminate the id but to allow its energies expression in sublimated form.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Defence Mechanisms',
    content: `Defence mechanisms are unconscious strategies the ego uses to manage anxiety arising from conflict between id, ego, and superego, or between the self and external threats. Key defences: Repression — banishing unacceptable thoughts from consciousness (the foundation of all other defences). Projection — attributing one's own unacceptable impulses to another. Displacement — redirecting an impulse from its original object to a safer substitute. Reaction formation — replacing an unacceptable impulse with its opposite (e.g. excessive kindness masking rage). Intellectualisation — using abstract thinking to avoid emotional experience. Rationalisation — constructing logical justifications for impulses or actions. Sublimation — redirecting drive energy into socially acceptable activity (the only truly successful defence). Splitting — experiencing self or other as all-good or all-bad, without integration. The analyst does not attack defences but brings them into awareness with curiosity, not criticism.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Transference',
    content: `Transference is the unconscious redirection of feelings, expectations, and relationship patterns from significant figures in the patient's past (typically parents) onto the analyst. The patient experiences the analyst not as they are but as a figure from their inner world. Positive transference (warmth, idealisation, erotic feelings toward the analyst) and negative transference (hostility, suspicion, disappointment) both carry analytic material. Rather than discouraging transference, the analyst uses it as the primary arena of the work: the past relationship is re-enacted in the present and can therefore be understood and worked through in real time. The interpretation of transference — "I wonder if what you're feeling toward me right now connects to what you felt toward your father" — is among the most mutative interventions in psychoanalysis. Countertransference (the analyst's own emotional reactions to the patient) is equally important data.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Dream Interpretation',
    content: `Freud called dreams "the royal road to the unconscious." In sleep, the ego's defensive activity is relaxed, allowing disguised expressions of unconscious wishes to emerge. The manifest content is the dream as remembered — its surface narrative. The latent content is the hidden unconscious wish or conflict the dream expresses, distorted by dreamwork through four mechanisms: condensation (multiple elements merged into one), displacement (emotional charge shifted from significant to insignificant element), symbolisation (abstract content represented concretely), and secondary revision (the dream narrative given apparent logic on waking). Analytic technique: ask the patient to free-associate to each element of the dream separately, without trying to interpret the dream as a whole. The associations, not the dream image itself, lead to the latent content. Common symbols carry individual meanings — do not apply universal symbol dictionaries.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Resistance',
    content: `Resistance is any force within the patient that opposes the analytic work — the unconscious opposition to becoming conscious. It is not conscious obstruction but the operation of the same repressive forces that created the symptom in the first place. Resistance manifests as: sudden topic changes, prolonged silence, arriving late or missing sessions, intellectual discussion that avoids emotional experience, agreeing with everything the analyst says, excessive talking that says nothing, forgetting dreams or recent material, and acting out rather than remembering. The analyst's task is not to overcome resistance but to analyse it: "I notice you've moved away from what you were saying — what came to mind just then?" The analysis of resistance IS the analysis; the content being defended against lies just behind it.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Interpretation in Psychoanalysis',
    content: `Interpretation is the primary instrument of analytic change — the verbal act of making unconscious meaning conscious. Effective interpretations: (1) Are timed carefully — too early, before sufficient material is present, they are rejected or intellectualised; too late, they are redundant. (2) Are tentative in form: "I wonder if...", "Could it be that...", "It strikes me that..." — not pronouncements. (3) Connect the present to the past (genetic interpretations) or the relationship to the analyst to outside relationships (transference interpretations). (4) Address defence before drive — interpret what the patient is doing, then what they are defending against. (5) Are short and specific rather than comprehensive. The patient's emotional response — recognition, resistance, or new associations — is the test of an interpretation's accuracy, not its intellectual elegance.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Object Relations Theory',
    content: `Object relations theory, developed by Melanie Klein, Ronald Fairbairn, and Donald Winnicott, shifts the focus of psychoanalysis from drives seeking discharge to the self seeking relationship. "Object" in this context means a representation of another person (or part of a person) as experienced internally. Klein identified two fundamental positions: the paranoid-schizoid position (early infancy), where the self and objects are experienced as all-good or all-bad (splitting), and objects are related to as part-objects (breast, not mother); and the depressive position, where the child achieves the capacity to experience the same person as both good and bad — tolerating ambivalence, feeling guilt and concern for the other. Failure to fully achieve the depressive position leaves the person vulnerable to splitting, idealisation, and persecutory anxiety throughout life.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Winnicott: The True Self, False Self and Good Enough Mothering',
    content: `Donald Winnicott introduced the concept of the True Self — the spontaneous, authentic core of experience — and the False Self — a compliance-based persona developed to manage an environment that could not tolerate the True Self. When a mother (or primary carer) is not "good enough" — when she cannot mirror, hold, or respond to the infant's authentic gestures — the infant must adapt to her needs rather than express its own. This produces a False Self organisation: a person who functions competently but feels fundamentally unreal, empty, or as though life is being lived from behind glass. The transitional object (a toy, blanket) represents the first "not-me" possession — a bridge between inner and outer reality that the infant creates in the space of good enough care. Analytic work with False Self pathology involves creating conditions where the True Self can risk emerging.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Repetition Compulsion',
    content: `The repetition compulsion is the unconscious tendency to re-enact painful early relationship patterns rather than remember them. Freud observed that patients did not simply remember their conflicts — they lived them out, in their current relationships, in their symptoms, and in the transference. A person abused by a critical parent unconsciously seeks critical partners; a person abandoned seeks those who will abandon them. This is not masochism but the ego's attempt to master an old trauma by encountering it again under different conditions — an attempt that fails because the compulsion operates outside awareness. The analytic goal is to transform repetition into remembering: when the patient can say "I see that I've been doing this" rather than simply doing it, the compulsion loses its grip. The transference is the royal road to repetition compulsion.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Parapraxis (Freudian Slips)',
    content: `A parapraxis (Fehlleistung — "faulty action") is an error in speech, memory, or action that reveals unconscious intention: saying the wrong name, forgetting an appointment, losing an important document, making a revealing slip of the tongue. Freud demonstrated that these are not random errors but motivated — the unconscious achieves expression precisely in the gap between intention and execution. In clinical work: when a patient makes a slip, the analyst does not immediately interpret it but invites association: "You said [X] — what comes to mind?" The patient's associations to the error reveal its unconscious meaning far more reliably than the analyst's interpretation. Parapraxes outside the session — forgetting the session time, arriving at the wrong time — may express resistance or unconscious feelings about the analytic relationship.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'The Analytic Frame',
    content: `The analytic frame is the consistent, reliable set of conditions within which analysis takes place: regular meeting times, consistent duration, the same room, the agreed fee, the analyst's relative anonymity and neutrality. The frame creates a bounded space — separate from ordinary life — in which the patient's unconscious material can emerge safely. The frame is not arbitrary rigidity but a container: the more reliably it is held, the more freely the patient can regress, associate, and bring the full weight of their inner world. Breaks in the frame — cancelled sessions, lateness, changes of time — are analytic material: how the patient responds to them reveals their internal object world. The analyst's anonymity (avoiding self-disclosure) allows the patient's transference projections to develop without contamination by the analyst's real personality.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Narcissism and the Ego Ideal',
    content: `Freud distinguished primary narcissism (the infant's original self-love, before objects are differentiated) from secondary narcissism (libido withdrawn from objects and returned to the ego, as in grief, illness, or certain pathologies). The ego ideal is the grandiose image of the self the person strives to embody — formed partly from the idealised image of the parents, partly from primary narcissism. When the self falls short of the ego ideal, shame results. Narcissistic pathology involves a fragile self that requires constant admiration (narcissistic supply) to regulate self-esteem, hypersensitivity to criticism, difficulty sustaining genuine interest in others (who exist primarily as mirrors), and oscillation between grandiosity and deflation. The analytic task is not to attack the grandiosity but to understand what it protects against — typically a deeply shamed or worthless inner self.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Working Through',
    content: `Working through (Durcharbeitung) is the process by which an interpretation, once given, is gradually integrated into the patient's experience across many sessions. A single correct interpretation does not produce lasting change; the unconscious conflict must be encountered repeatedly, from different angles, in different contexts, in the transference and outside it, until the patient has truly assimilated its meaning at an emotional rather than merely intellectual level. Working through is painstaking and unglamorous — it involves the analyst returning to the same material again and again, tolerating the patient's resistance, and trusting the slow process of psychic change. The patient's resistance to working through is itself material: "I understand this intellectually but nothing changes" often indicates that the defence of intellectualisation is itself the object of analysis.`
  },

  {
    specialty: 'psychoanalysis',
    title: 'Drives: Eros and Thanatos',
    content: `In Freud's dual drive theory, all human motivation is ultimately rooted in two fundamental drives: Eros (the life drive), which seeks connection, pleasure, growth, and the binding together of psychic and biological energy; and Thanatos (the death drive), which tends toward dissolution, aggression, repetition, and return to an inorganic state. The death drive is expressed outwardly as aggression and destructiveness; turned inward, it becomes self-destructiveness, masochism, and the compulsion to repeat painful experiences. In clinical work, Thanatos manifests in the patient's resistance to getting better, in self-sabotage at the moment of progress, and in the repetition compulsion. The analyst does not pathologise these forces but tries to understand them: "What part of you is invested in staying the same?"`,
  },
]
