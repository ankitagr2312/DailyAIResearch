import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import ollama
import json
from datetime import date


async def main():
    # 1. Define how to start the arxiv-mcp-server (via uv)
    server_params = StdioServerParameters(
        command="uv",
        args=[
            "tool",
            "run",
            "arxiv-mcp-server",
            "--storage-path",
            "/tmp/arxiv-papers",  # change to whatever path you like
        ],
        env=None,
    )

    # 2. Connect to the MCP server over stdio
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Required: set up MCP session
            await session.initialize()

            # Optional: see what tools the server exposes
            tools = await session.list_tools()
            print("Available tools from arxiv-mcp-server:")
            for t in tools.tools:
                print("-", t.name)

            # 3. Call the `search_papers` tool on the arxiv MCP server
            #    (This tool is defined in the arxiv-mcp-server README)
            search_args = {
                "query": "ai",
                "max_results": 5,
                # you can tweak these filters or omit them
                "date_from": "2025-12-11",
                "categories": ["cs.AI", "cs.LG"],
            }

            print("\nCalling search_papers with args:", search_args)

            search_result = await session.call_tool(
                "search_papers",
                arguments=search_args,
            )

            # The exact structure depends on the server implementation;
            # for now, just turn it into JSON text to feed to Ollama.
            # search_result is a CallToolResult
            texts = []
            for item in search_result.content:
                # Each item is typically a TextContent with a .text attribute
                text = getattr(item, "text", None)
                if text is not None:
                    texts.append(text)

            search_result_text = "\n\n".join(texts)

            print("\nTool returned text:\n", search_result_text)

            #print("\nRaw search result from MCP:\n", search_result_text)

            # 4. Use Ollama to summarize the search results
            prompt = f"""
You are an AI research assistant.

Here are some raw search results from an arXiv MCP server (JSON):

{search_result_text}

Please:
- List the papers found with title + arxiv id
- Give a short 2–3 line summary for each paper
- Mention if any papers are especially relevant for understanding transformer architectures.
"""

            print("\nAsking Ollama to summarize...\n")

            ollama_response = ollama.chat(
                model="gemma3:1b",  # or whichever model you pulled
                messages=[
                    {
                        "role": "system",
                        "content": "You are a concise research assistant.",
                    },
                    {"role": "user", "content": prompt},
                ],
            )

            print("Ollama summary:\n")
            print(ollama_response["message"]["content"])


if __name__ == "__main__":
    asyncio.run(main())