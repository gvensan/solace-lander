#!/usr/bin/env node
// One-time: append the approved YouTube playlists/videos to each focus area's "watch"
// group in lib/data/pillar-references.json, then de-duplicate every focus area by URL
// (keeping the first occurrence, which respects group order). Reports what was removed.
const fs = require("node:fs");
const path = require("node:path");

const FILE = path.join(__dirname, "..", "lib", "data", "pillar-references.json");
const PL = (id) => `https://www.youtube.com/playlist?list=${id}`;
const V = (id) => `https://www.youtube.com/watch?v=${id}`;

// group is "watch" for all of these
const ADD = {
  "event-mesh": [
    ["Event Mesh for Event-Driven Architecture (playlist)", PL("PLY1Ks8JEfJR4x4aIC0gopWMNzfgSMG5jH")],
    ["Event-Driven Architecture (playlist)", PL("PLY1Ks8JEfJR5mf6RkxRZWOFukSqu_E6Db")],
    ["Learning about Queues and Topics (playlist)", PL("PLY1Ks8JEfJR57vCkrQK0Y9bn8DKNMMJI_")],
    ["Solace Platform: Real-Time Data Streaming & Management (playlist)", PL("PLY1Ks8JEfJR5CbNSQ6OYfXH6LwDrs0-cC")],
    ["PubSub+ Hybrid Cloud Solutions (playlist)", PL("PLY1Ks8JEfJR4NlJrbHzB4D1HJfG6UME1l")],
    ["United: Taking Airline Operations to New Heights with Real-Time Data (video)", V("te6TkfktLpk")],
  ],
  "integrations": [
    ["Using Solace with Apache Kafka (playlist)", PL("PLY1Ks8JEfJR7LaeX6EKZIgfzVpbGzqWOH")],
    ["From Data to Action: SAP Event Specs into the AEM Event Portal (playlist)", PL("PLY1Ks8JEfJR4kXDDFX_AI3lWSIgY1hf4l")],
    ["Event-Driven Microservices (playlist)", PL("PLY1Ks8JEfJR6_qD-i083u8hZ5VrH-JgEY")],
    ["Serverless with Solace (playlist)", PL("PLY1Ks8JEfJR7Z56oysvd-n262nEs2-OKj")],
  ],
  "apis-dev-tools": [
    ["Solace Try Me CLI Tool (playlist)", PL("PLY1Ks8JEfJR4P7FQUdtpF8gBOETB3dOk_")],
    ["Solace Schema Registry (playlist)", PL("PLY1Ks8JEfJR6eOpFbHOepXtO-K7T4s1u9")],
    ["Solace Developer & Community How-To's (playlist)", PL("PLY1Ks8JEfJR7VciBYCjglVak2gJj3al32")],
    ["Solace Platform MCP (playlist)", PL("PLY1Ks8JEfJR5e4dDxcxKz-XL-etJRvuFn")],
    ["Using the Solace Try Me CLI MCP Server with Claude Code (video)", V("T6g8eE95zlw")],
    ["AI-Enhanced Field Mapping in Solace Try Me CLI (video)", V("cA9s2QpfcL8")],
  ],
  "design-govern": [
    ["Event Portal: Manage Your Event-Driven Applications (playlist)", PL("PLY1Ks8JEfJR6za1LYULYqO_jgPHWa_0tw")],
    ["Import Existing Architectures into Event Portal with Claude Code (video)", V("CgxKm-q1l28")],
    ["Setting Up Solace Event Portal MCP Server with Claude Code (video)", V("VQ_dxa1IPIs")],
  ],
  "operate-observe": [
    ["Distributed Tracing in Event-Driven Architecture (playlist)", PL("PLY1Ks8JEfJR7jWm3aafht9cou2oleB_Ef")],
  ],
  "agentic-ai": [
    ["Solace Agent Mesh Explained — Getting Started (playlist)", PL("PLY1Ks8JEfJR6qxf-XL9UKHlQc2XRn82OM")],
    ["Solace Agent Mesh — Deep Dive (playlist)", PL("PLY1Ks8JEfJR77XmsAU6BKnZ8uDjtHjU2q")],
    ["Workflows for Solace Agent Mesh (playlist)", PL("PLY1Ks8JEfJR4K0BtSBJLpA0aOffdT2kYs")],
    ["Plugins for Solace Agent Mesh (playlist)", PL("PLY1Ks8JEfJR6hOoQTTTOQ0yMeIVZo_mFb")],
    ["Build & Orchestrate Real-Time Agentic AI (video)", V("4yfZzrXhLIU")],
    ["Introductory Guide to AI Fundamentals: LLMs, RAG & Agentic AI (video)", V("n8oN4wyix08")],
    ["RAG Agent with Solace Agent Mesh (video)", V("8patKmzbvu8")],
  ],
};

const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

let added = 0;
for (const [area, entries] of Object.entries(ADD)) {
  if (!data[area]) { console.log(`!! unknown focus area: ${area}`); continue; }
  for (const [title, url] of entries) {
    data[area].push({ group: "watch", title, url });
    added += 1;
  }
}

// De-duplicate each focus area by URL (keep first occurrence).
let removed = 0;
for (const [area, refs] of Object.entries(data)) {
  const seen = new Set();
  const kept = [];
  for (const r of refs) {
    if (seen.has(r.url)) {
      removed += 1;
      console.log(`  dup removed [${area}] (${r.group}) ${r.title} -> ${r.url}`);
      continue;
    }
    seen.add(r.url);
    kept.push(r);
  }
  data[area] = kept;
}

// Serialize one ref-object per line to match the existing file style.
const body = Object.entries(data)
  .map(([id, refs]) => {
    const lines = refs.map((r) => "    " + JSON.stringify(r)).join(",\n");
    return `  ${JSON.stringify(id)}: [\n${lines}\n  ]`;
  })
  .join(",\n");
fs.writeFileSync(FILE, "{\n" + body + "\n}\n");

console.log(`\nAdded ${added} watch entries; removed ${removed} duplicate URL(s).`);
for (const [id, refs] of Object.entries(data)) console.log(`  ${id}: ${refs.length} references`);
