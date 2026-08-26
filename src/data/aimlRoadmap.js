import { Brain, Zap, Workflow, Sparkles, Shield, Terminal, Award } from 'lucide-react';

export const AIML_CURRICULUM = {
  id: 'aiml',
  title: 'Artificial Intelligence & Machine Learning',
  subtitle: 'Out-of-Core Data Architecture, Math & Agentic MLOps',
  badge: 'Advanced MLOps & GenAI',
  schedule: '1.5 Hours per Day | 5 Days per Week',
  icon: Brain,
  contract: [
    {
      title: 'Project-Based Learning (PBL)',
      desc: 'Every mathematical formula, neural layer, and inference optimization strategy is taught by solving massive production-scale enterprise data challenges.',
      icon: Zap
    },
    {
      title: 'Industrial Jira & Confluence Governance',
      desc: 'Data pipelines are split into Epics, Stories, and Tasks. Training parameters and search spaces are codified into Confluence RFCs before compiling.',
      icon: Workflow
    },
    {
      title: '3Blue1Brown & TensorFlow Visualizations',
      desc: 'Learn visual intuition via 3Blue1Brown lesson architectures, TensorFlow Playground sandboxes, and live TensorBoard loss/gradient dashboards.',
      icon: Sparkles
    },
    {
      title: 'Pre-AI Architect & Post-AI Inspector',
      desc: 'Lock down tensor dimensions & Mermaid.js flowcharts before writing code. Post-generation, profile GPU VRAM bounds, execution latency, and token costs.',
      icon: Shield
    },
    {
      title: 'The 15-Minute Rule',
      desc: 'If a training run crashes or throws tensor mismatches, isolate the exact line in the stack trace for 15 minutes before seeking instructor doubt help.',
      icon: Terminal
    },
    {
      title: 'The Whiteboard Model Defense',
      desc: 'Evaluations are strictly unassisted oral exams. Stand at the whiteboard and explain random layers, weight variables, and hardware trade-offs.',
      icon: Award
    }
  ],
  parts: [
    {
      id: 'aiml-part-1',
      number: 'Part 1',
      title: 'Mathematical Foundations & Data Core',
      subtitle: 'Rigorous mathematical core powering multi-dimensional GPU tensor operations and statistical analysis.',
      modules: [
        {
          id: 'aiml-1-1',
          name: 'Linear Algebra',
          desc: 'Vector spaces, matrix transformations, eigenvalues and eigenvectors, dot products, matrix factorization, and singular value decomposition (SVD). Learning how data tensors are structured and multiplied across GPU hardware layers.',
          tags: ['Vector Spaces', 'Eigenvalues', 'SVD', 'GPU Tensors', 'Matrix Math'],
          visualTool: '3Blue1Brown Matrix Animations'
        },
        {
          id: 'aiml-1-2',
          name: 'Calculus & Optimization',
          desc: 'Multi-variable limits, partial derivatives, the chain rule, gradients, and Taylor series expansions. Mastering how backpropagation calculates errors across deep layer stacks.',
          tags: ['Partial Derivatives', 'Chain Rule', 'Gradients', 'Backpropagation', 'Taylor Series'],
          visualTool: 'Gradient Descent Surface Plots'
        },
        {
          id: 'aiml-1-3',
          name: 'Statistics & Probability',
          desc: 'Probability distributions (Normal, Binomial, Poisson), central limit theorem, hypothesis testing, p-values, confidence intervals, maximum likelihood estimation (MLE), Bayesian probability, and bias/variance metrics.',
          tags: ['Normal/Poisson', 'Hypothesis Testing', 'MLE', 'Bayesian Stats', 'p-values'],
          visualTool: 'Interactive Distribution Simulators'
        },
        {
          id: 'aiml-1-4',
          name: 'NumPy High-Performance Vectorization',
          desc: 'High-performance multi-dimensional array operations, vectorization techniques, broadcasting rules, indexing, slicing, memory-view layouts, and native linear algebra computations.',
          tags: ['Vectorization', 'Broadcasting', 'Memory-View Layouts', 'Array Slicing', 'NumPy'],
          visualTool: 'Array Stride Visualizer'
        },
        {
          id: 'aiml-1-5',
          name: 'Pandas & Out-of-Core DataFrames',
          desc: 'Structuring complex file datasets. Managing DataFrames, out-of-memory memory mapping rules, handling missing values, data alignment, advanced grouping, pivoting, and merging operations.',
          tags: ['DataFrames', 'Memory Mapping', 'Pivoting', 'Data Alignment', 'Aggregation'],
          visualTool: 'Dataset Pipeline Diagrams'
        },
        {
          id: 'aiml-1-6',
          name: 'Plotly Interactive Visualizations',
          desc: 'Interactive data visualization. Building dynamic distribution plots, correlation heatmaps, multi-dimensional scatter graphs, and production data science monitoring dashboards.',
          tags: ['Plotly', 'Heatmaps', 'Scatter Matrices', 'Monitoring Dashboards', 'Visual Analytics'],
          visualTool: 'Real-Time Plotly Dash'
        }
      ]
    },
    {
      id: 'aiml-part-2',
      number: 'Part 2',
      title: 'Machine Learning & Incremental MLOps',
      subtitle: 'Scalable supervised and unsupervised algorithms designed to handle datasets exceeding RAM capacity.',
      modules: [
        {
          id: 'aiml-2-1',
          name: 'Supervised Learning Mechanics',
          desc: 'Classification vs. Regression problem framing. Managing model degrees of freedom to balance the bias/variance trade-off.',
          tags: ['Classification', 'Regression', 'Bias/Variance Tradeoff', 'Loss Functions'],
          visualTool: 'Decision Boundary Visualizer'
        },
        {
          id: 'aiml-2-2',
          name: 'Core Predictive Algorithms',
          desc: 'Implementing Linear and Polynomial Regression. Deep-dive into Support Vector Machines (SVMs) utilizing kernels to find maximum margin boundaries. Deploying Decision Trees and Ensemble Methods (Bagging, Random Forests, Gradient Boosting, Stacking).',
          tags: ['SVMs', 'Kernel Trick', 'Random Forests', 'Gradient Boosting', 'Stacking'],
          visualTool: 'Tree Ensemble Split Grapher'
        },
        {
          id: 'aiml-2-3',
          name: 'Out-of-Core Incremental Training',
          desc: 'Abandoning standard batch loops when data volumes exceed system RAM. Mastering Scikit-Learn’s partial_fit API for online learning. Streaming data in minibatches to update model parameters without local system crashes. Implementing Regularization (L1 Lasso / L2 Ridge) to manually constrain parameters during incremental loops.',
          tags: ['partial_fit API', 'Online Learning', 'Out-of-Core Streaming', 'L1/L2 Regularization', 'Minibatches'],
          visualTool: 'TensorFlow Playground Sandbox'
        },
        {
          id: 'aiml-2-4',
          name: 'Unsupervised Learning & Scalability',
          desc: 'Addressing the curse of dimensionality using feature space reduction. Executing Principal Component Analysis (PCA) and Randomized PCA for rapid variance-based approximations.',
          tags: ['Curse of Dimensionality', 'PCA', 'Randomized PCA', 'Eigenvectors', 'Dimensionality Reduction'],
          visualTool: '3D PCA Projection Plot'
        },
        {
          id: 'aiml-2-5',
          name: 'Out-of-Core Feature Extraction',
          desc: 'Deploying Incremental PCA for feature compression when datasets are too large for memory. Implementing Locally Linear Embedding (LLE) for non-linear manifold learning.',
          tags: ['Incremental PCA', 'LLE', 'Manifold Learning', 'Feature Compression'],
          visualTool: 'Swiss Roll Manifold Unroller'
        },
        {
          id: 'aiml-2-6',
          name: 'Clustering & Detection Engines',
          desc: 'Custom consumer segmentation using K-Means and Mini-Batch K-Means. Deploying DBSCAN for noise-heavy production environments with arbitrary cluster geometry. Differentiating between Anomaly Detection and Novelty Detection.',
          tags: ['K-Means', 'Mini-Batch K-Means', 'DBSCAN', 'Anomaly Detection', 'Novelty Detection'],
          visualTool: 'Cluster Density Heatmaps'
        },
        {
          id: 'aiml-2-7',
          name: 'Unsupervised MLOps (Data Drift)',
          desc: 'Monitoring model rot and performance degradation as real-world data distributions evolve over time. Isolating drift triggered by system hardware modifications.',
          tags: ['Data Drift', 'Concept Drift', 'Model Rot', 'MLOps Monitoring', 'Distribution Shift'],
          visualTool: 'Drift Detection Dashboard'
        }
      ]
    },
    {
      id: 'aiml-part-3',
      number: 'Part 3',
      title: 'Neural Networks & Deep Learning Optimization',
      subtitle: 'Deep architectures, multi-GPU hardware acceleration, mixed-precision, and model quantization.',
      modules: [
        {
          id: 'aiml-3-1',
          name: 'Deep Learning Foundations',
          desc: 'Stacks of artificial neurons transitioning from manual feature engineering to automated sequence and spatial feature discovery.',
          tags: ['Perceptrons', 'Activation Functions', 'ReLU/GELU', 'Feature Discovery'],
          visualTool: '3Blue1Brown Neural Networks'
        },
        {
          id: 'aiml-3-2',
          name: 'Core Deep Architectures (FFNN, CNN, RNN/LSTM)',
          desc: 'Feed-Forward Neural Networks (FFNN) and the Backpropagation engine utilizing the mathematical chain rule to tune weights. Convolutional Neural Networks (CNNs) for tracking spatial visual data structures. Recurrent Neural Networks (RNNs/LSTMs) for extracting temporal dependencies in text and audio streams.',
          tags: ['FFNN', 'Backpropagation', 'CNNs', 'RNNs/LSTMs', 'Spatial/Temporal Convolutions'],
          visualTool: 'CNN Kernel Activation Maps'
        },
        {
          id: 'aiml-3-3',
          name: 'Transformer Architectures',
          desc: 'The modern gold standard for sequential processing. Deep dive into the Self-Attention Mechanism, Multi-Head Attention, and Positional Encodings to evaluate long-range sequence context.',
          tags: ['Self-Attention', 'Transformers', 'Multi-Head Attention', 'Positional Encodings', 'QKV Matrices'],
          visualTool: 'Attention Matrix Heatmaps'
        },
        {
          id: 'aiml-3-4',
          name: 'Deep Hardware Optimization (PyTorch CUDA & FP16)',
          desc: "Shifting computations safely across memory lines from CPU RAM to GPU VRAM using PyTorch .to('cuda'). Implementing Mixed-Precision Training (FP16/FP32) using tensor cores to maximize hardware processing speeds and prevent VRAM crashes.",
          tags: ['PyTorch CUDA', 'Mixed-Precision (FP16/FP32)', 'Tensor Cores', 'VRAM Allocation', 'Gradient Scaling'],
          visualTool: 'PyTorch Profiler Timeline'
        },
        {
          id: 'aiml-3-5',
          name: 'Model Quantization Frameworks',
          desc: 'Compressing model weights to survive strict hardware resource budgets. Loading, running, and evaluating open-source models under varying precision constraints using formats like GGUF, AWQ, and GPTQ, alongside runtime optimization configurations using the bitsandbytes library.',
          tags: ['GGUF', 'AWQ', 'GPTQ', 'bitsandbytes', '4-bit/8-bit Quantization', 'LLM Compression'],
          visualTool: 'Weight Precision Loss Graphs'
        }
      ]
    },
    {
      id: 'aiml-part-4',
      number: 'Part 4',
      title: 'Advanced Generative AI & Agentic Systems',
      subtitle: 'Production RAG, GraphRAG, autonomous tool-use agents, multi-agent memory loops, and inference optimization.',
      modules: [
        {
          id: 'aiml-4-1',
          name: 'Generative Control Layers',
          desc: 'Moving past basic predictions to controlled text outputs. Deploying Logits Masking and Grammar Constraints to force models to return structured format outputs (like strict JSON objects). Implementing Preference Tuning (RLHF) and Style Transfer to align models with brand voices.',
          tags: ['Logits Masking', 'Grammar Constraints', 'Structured JSON', 'RLHF', 'Style Transfer'],
          visualTool: 'Sampling Logit Distribution'
        },
        {
          id: 'aiml-4-2',
          name: 'Multi-Level RAG Architectures',
          desc: 'Building scalable Retrieval-Augmented Generation. Implementing semantic index layouts via text chunking and vector embeddings. Managing the lifecycle of sharded embeddings alongside metadata filtering metrics.',
          tags: ['RAG', 'Vector Embeddings', 'Chunking Strategies', 'Sharded Indexes', 'Metadata Filtering'],
          visualTool: 'RAG Retrieval Flowcharts'
        },
        {
          id: 'aiml-4-3',
          name: 'Vector Index Internals (HNSW vs. IVF-PQ)',
          desc: 'Deep-dive mathematical and algorithmic analysis of vector similarity searches at scale. Evaluating the structural trade-offs between HNSW (Hierarchical Navigable Small World graphs for ultra-low latency accuracy) and IVF-PQ (Inverted File with Product Quantization for aggressive embedding memory compression).',
          tags: ['HNSW Graphs', 'IVF-PQ Quantization', 'Vector DB Internals', 'Cosine/L2 Distance', 'Milvus/Qdrant'],
          visualTool: 'HNSW Graph Layer Traversal'
        },
        {
          id: 'aiml-4-4',
          name: 'Advanced Data Retrieval (GraphRAG)',
          desc: 'Implementing Index-Aware Retrieval (GraphRAG) for mapping complex relationships across documents. Deploying Node Postprocessing including Reranking models (Cohere/BGE) and Contextual Compression to maximize prompt context efficiency.',
          tags: ['GraphRAG', 'Knowledge Graphs', 'Cross-Encoders', 'Reranking', 'Contextual Compression'],
          visualTool: 'GraphRAG Relational Knowledge Graph'
        },
        {
          id: 'aiml-4-5',
          name: 'Generative Reliability & Reasoning (CoT/ToT)',
          desc: 'Implementing citation-backed generation and Out-of-Domain (OOD) data detection to mitigate hallucinations. Utilizing Chain of Thought (CoT) and Tree of Thoughts (ToT) prompting frameworks to resolve complex multi-step reasoning problems.',
          tags: ['Chain of Thought', 'Tree of Thoughts', 'OOD Detection', 'Hallucination Mitigation', 'Prompt Engineering'],
          visualTool: 'ToT Tree Search Explorer'
        },
        {
          id: 'aiml-4-6',
          name: 'Efficient Adaptation (LoRA & QLoRA)',
          desc: 'Tuning models efficiently using Low-Rank Adaptation (LoRA) and QLoRA to inject new capabilities without the massive compute overhead of full parameter weight re-training.',
          tags: ['LoRA', 'QLoRA', 'PEFT', 'Adapter Weights', 'Fine-Tuning'],
          visualTool: 'Low-Rank Matrix Rank Decomposition'
        },
        {
          id: 'aiml-4-7',
          name: 'Actionable Autonomous Agents',
          desc: 'Transforming language models into active agents capable of planning, error reflection, and executing tools inside secure sandboxed execution environments.',
          tags: ['Autonomous Agents', 'Tool Calling', 'Sandboxed Execution', 'ReAct Pattern', 'Planning Loops'],
          visualTool: 'Agent Step-by-Step Call Graph'
        },
        {
          id: 'aiml-4-8',
          name: 'Agentic Workflows & Memory Systems',
          desc: 'Building multi-agent systems structured as Hierarchical (Manager-Worker) or Peer-to-Peer (Collaborative) loops. Designing advanced agent memory setups, separating Episodic Memory (short-term session context trackers) from Semantic/Procedural Memory (long-term knowledge and task execution rules).',
          tags: ['Multi-Agent Swarms', 'Hierarchical Orchestration', 'Episodic Memory', 'Semantic Memory', 'LangGraph'],
          visualTool: 'Swarm Orchestration Architecture'
        },
        {
          id: 'aiml-4-9',
          name: 'Inference Optimization Trade-offs',
          desc: 'Sacrificing minimal compute to secure massive jumps in model throughput tokens-per-second. Deploying Speculative Decoding, Continuous Batching request flows (vLLM/TGI), and Prefix Prompt Caching to minimize Time-to-First-Token (TTFT) latency.',
          tags: ['Speculative Decoding', 'Continuous Batching', 'Prefix Prompt Caching', 'TTFT', 'vLLM'],
          visualTool: 'Token Throughput Speedometer'
        }
      ]
    },
    {
      id: 'aiml-part-5',
      number: 'Part 5',
      title: 'Production LLMOps & High-Level Design (HLD)',
      subtitle: 'Non-deterministic validation, enterprise guardrails, 5 Signature Blueprints, and 30 Whiteboard HLD Case Studies.',
      modules: [
        {
          id: 'aiml-5-1',
          name: 'LLMOps Quality, Safety & Lineage',
          desc: 'Advanced validation using LLM-as-Judge frameworks, Reflection loops, and DSPy for automated prompt optimization. Enterprise Guardrails for prompt injection, token logprobs self-checks, and PII leakage. Data & Model Lineage with DVC and MLflow Model Registry.',
          tags: ['LLM-as-Judge', 'DSPy', 'Guardrails', 'PII Sanitization', 'DVC', 'MLflow Model Registry'],
          visualTool: 'MLflow Lineage Graph'
        }
      ]
    }
  ],
  blueprints: [
    {
      number: 'Blueprint 1',
      track: 'Supervised MLOps',
      title: 'Incremental Trip Fare Prediction Engine',
      desc: 'Ingesting a 50 GB Parquet NYC Taxi dataset out-of-core using PyArrow streaming into an SGDRegressor using online partial_fit training loops.',
      visualFoundation: 'TensorFlow Playground',
      tech: ['PyArrow', 'Parquet', 'SGDRegressor', 'partial_fit', 'Scikit-Learn']
    },
    {
      number: 'Blueprint 2',
      track: 'Unsupervised MLOps',
      title: 'Large-Scale Network Anomaly Detection',
      desc: 'Processing a 35 GB raw security log dataset using Incremental PCA for feature extraction, combined with Mini-Batch K-Means to isolate security threats via reconstruction error metrics.',
      visualFoundation: 'Feature Variance Clusters',
      tech: ['Incremental PCA', 'Mini-Batch K-Means', 'Reconstruction Error', 'Security Logs']
    },
    {
      number: 'Blueprint 3',
      track: 'Deep Learning',
      title: 'Custom Vision Transformer (ViT) Classifier',
      desc: 'Handling a 120 GB ImageNet subset to train a custom self-attention Vision Transformer optimized via mixed-precision FP16/FP32 operations on multi-GPU nodes.',
      visualFoundation: '3Blue1Brown Neural Network Animations',
      tech: ['Vision Transformer (ViT)', 'PyTorch CUDA', 'Mixed Precision FP16', 'Multi-GPU']
    },
    {
      number: 'Blueprint 4',
      track: 'Generative AI',
      title: 'Enterprise-Grade Hybrid RAG Mesh',
      desc: 'Parsing 40 GB of SEC EDGAR financial filings using a GraphRAG relational index, backed by prefix prompt caching to eliminate multi-turn query latency.',
      visualFoundation: '3Blue1Brown Attention Modules',
      tech: ['GraphRAG', 'Prefix Prompt Caching', 'Vector Embeddings', 'SEC EDGAR']
    },
    {
      number: 'Blueprint 5',
      track: 'Agentic Systems',
      title: 'Sandboxed Multi-Agent Code Repair Pipeline',
      desc: 'Managing an 85 GB corporate software codebase using an autonomous triad of agents (Planner, Executor, Reviewer) where the Reviewer parses code inside isolated Docker containers before commits.',
      visualFoundation: 'Agent Docker Sandbox Orchestration',
      tech: ['Docker Containers', 'Triad Agents (Planner/Executor/Reviewer)', 'LangGraph', 'Automated AST Fixes']
    }
  ],
  hldCases: [
    '1. Distributed Vector Search Engine (Milvus/Qdrant sharding)',
    '2. Autonomous Customer Support Swarm',
    '3. Real-Time Financial Fraud Monitor',
    '4. Automated Content Moderation Engine',
    '5. Multi-Tenant Model Gateway Proxy',
    '6. Large-Scale Recommendation Engine (Two-Tower Model)',
    '7. Real-Time Video Stream Object Tracker',
    '8. Enterprise Semantic Search & Document Deduplication',
    '9. Streaming Feature Store (Feast / Redis)',
    '10. Global Distributed Model Registry with Automated Canary Rollouts',
    '11. Low-Latency Voice-to-Voice AI Agent Gateway',
    '12. Automated Code Migration & Modernization Engine',
    '13. High-Throughput Batch LLM Evaluation Cluster',
    '14. Edge-Device Quantized Model Sync Infrastructure',
    '15. Real-Time Ad Bidding Click-Through Rate (CTR) Predictor',
    '16. Intelligent Document Processing (IDP) OCR Mesh',
    '17. Distributed Training Pipeline across Multi-Node Slurm Cluster',
    '18. Dynamic Guardrail Proxy with PII Redaction & Cache-Aside',
    '19. Autonomous Log Triaging & Self-Healing Incident Bot',
    '20. Enterprise GraphRAG Knowledge Extractor for Medical Trials',
    '21. Real-Time Dynamic Pricing Engine with Reinforcement Learning',
    '22. Cross-Lingual Live Translation & Dubbing Pipeline',
    '23. Multi-Modal Visual Search Engine for E-Commerce',
    '24. Autonomous Jira Ticket Auto-Assignment & Priority Estimator',
    '25. Synthetic Data Generation & Validation Mesh',
    '26. Automated Threat Intelligence & Malware Detection Mesh',
    '27. High-Volume Text Summarization with Continuous Batching',
    '28. Multi-Model Router (Cost vs Quality Optimization Proxy)',
    '29. Dynamic Prompt Cache Orchestrator for Multi-Turn Chat',
    '30. Scalable Active Learning Pipeline with Human-in-the-Loop Feedback'
  ]
};
