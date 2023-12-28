import type { Document } from "langchain/document"
import { CSVLoader } from "langchain/document_loaders/fs/csv"
import { DocxLoader } from "langchain/document_loaders/fs/docx"
import { JSONLoader } from "langchain/document_loaders/fs/json"
import { TextLoader } from "langchain/document_loaders/fs/text"
import { WebPDFLoader } from "langchain/document_loaders/web/pdf"
import markdown from "remark-parse"
import { unified } from "unified"
import { visit } from "unist-util-visit"

import type { SourceEntity } from "@/lib/types"

const getPdfDocument = async (file: Blob) => {
  const loader = new WebPDFLoader(file, {
    splitPages: false,
  })
  const docs = await loader.load()
  return docs
}

const getCsvDocument = async (file: Blob) => {
  const loader = new CSVLoader(file)
  const docs = await loader.load()
  return docs
}

const getDocxDocument = async (file: Blob) => {
  const loader = new DocxLoader(file)
  const docs = await loader.load()
  return docs
}

const getTextDocument = async (file: Blob) => {
  const loader = new TextLoader(file)
  const docs = await loader.load()
  return docs
}

const getMarkdownDocument = async (file: Blob) => {
  const text = await file.text()
  const processor = unified().use(markdown)
  const tree = processor.parse(text)

  const documents: Document<Record<string, any>>[] = await Promise.all(
    tree.children.map(async (node) => {
      let pageContent = ""
      visit(node, "text", (textNode) => {
        pageContent += textNode.value
      })
      // @todo add metadata
      const document: Document<Record<string, any>> = {
        pageContent,
        metadata: {},
      }
      return document
    })
  )

  return documents
}

const getJsonDocument = async (file: Blob) => {
  const loader = new JSONLoader(file)
  const docs = await loader.load()
  return docs
}

const populateDocsWithMetadata = (
  docs: Document<Record<string, any>>[],
  source: SourceEntity
) => {
  return docs.map((doc) => ({
    ...doc,
    metadata: {
      user_id: source.user_id,
      source_id: source.id,
      url: source.url?.startsWith("http") ? source.url : undefined,
      title: source.title,
      author: "file-parser",
    },
  }))
}

export const parseFileToDocuments = async (
  file: Blob,
  source: SourceEntity
) => {
  let documents: Document<Record<string, any>>[] = []

  switch (file.type) {
    case "application/pdf":
      documents = await getPdfDocument(file)
      break
    case "text/csv":
      documents = await getCsvDocument(file)
      break
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      documents = await getDocxDocument(file)
      break
    case "text/plain":
      documents = await getTextDocument(file)
      break
    case "text/markdown":
      documents = await getMarkdownDocument(file)
      break
    case "application/json":
      documents = await getJsonDocument(file)
      break
    default:
      throw new Error("Unsupported file type")
  }

  return populateDocsWithMetadata(documents, source)
}
