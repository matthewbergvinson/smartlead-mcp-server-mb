/**
 * SmartLead MCP Server - Client Management Tools
 * 
 * Tools for managing SmartLead clients including creation, API key management,
 * and client configuration.
 * 
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SmartLeadClient } from '../client/index.js';
import { MCPToolResponse } from '../types/config.js';
import { z } from 'zod';

// ================================
// SCHEMAS
// ================================

const AddClientToSystemSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  is_whitelabel: z.boolean().optional().default(false),
  settings: z.any().optional(),
});

const CreateClientApiKeySchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()).optional(),
});

const GetClientApiKeysSchema = z.object({});

const DeleteClientApiKeySchema = z.object({
  api_key_id: z.number().int().positive(),
});

const ResetClientApiKeySchema = z.object({
  api_key_id: z.number().int().positive(),
});

// ================================
// TOOL REGISTRATION
// ================================

export function registerClientManagementTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data: any, summary?: string) => MCPToolResponse,
  handleError: (error: any) => MCPToolResponse
): void {
  // Add Client To System
  server.registerTool(
    'smartlead_add_client_to_system',
    {
      title: 'Add Client To System',
      description: 'Add a new client to the SmartLead system (whitelabel or not).',
      inputSchema: AddClientToSystemSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AddClientToSystemSchema.parse(params);
        const result = await client.clientManagement.addClientToSystem(validatedParams);
        return formatSuccessResponse(
          `Added client "${validatedParams.name}" to system`,
          result,
          `Client ID: ${result.id || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Create Client (alias)
  server.registerTool(
    'smartlead_create_client',
    {
      title: 'Create Client',
      description: 'Create a new client (alias for add client to system).',
      inputSchema: AddClientToSystemSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AddClientToSystemSchema.parse(params);
        const result = await client.clientManagement.createClient(validatedParams);
        return formatSuccessResponse(
          `Created client "${validatedParams.name}"`,
          result,
          `Client ID: ${result.id || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get All Clients
  server.registerTool(
    'smartlead_get_all_clients',
    {
      title: 'Get All Clients',
      description: 'Fetch all clients from the SmartLead system.',
      inputSchema: {},
    },
    async () => {
      try {
        const result = await client.clientManagement.getAllClients();
        return formatSuccessResponse(
          'Retrieved all clients',
          result,
          `Found ${result.length || 0} clients`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Create Client API Key
  server.registerTool(
    'smartlead_create_client_api_key',
    {
      title: 'Create Client API Key',
      description: 'Create a new API key for the current client with optional permissions.',
      inputSchema: CreateClientApiKeySchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = CreateClientApiKeySchema.parse(params);
        const result = await client.clientManagement.createClientApiKey(validatedParams);
        return formatSuccessResponse(
          `Created API key "${validatedParams.name}"`,
          result,
          `API Key ID: ${result.id || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Client API Keys
  server.registerTool(
    'smartlead_get_client_api_keys',
    {
      title: 'Get Client API Keys',
      description: 'Retrieve all API keys for the current client.',
      inputSchema: GetClientApiKeysSchema.shape,
    },
    async () => {
      try {
        const result = await client.clientManagement.getClientApiKeys();
        return formatSuccessResponse(
          'Retrieved client API keys',
          result,
          `Found ${result.length || 0} API keys`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Delete Client API Key
  server.registerTool(
    'smartlead_delete_client_api_key',
    {
      title: 'Delete Client API Key',
      description: 'Delete a specific API key.',
      inputSchema: DeleteClientApiKeySchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = DeleteClientApiKeySchema.parse(params);
        const result = await client.clientManagement.deleteClientApiKey(validatedParams.api_key_id);
        return formatSuccessResponse(
          `Deleted API key ${validatedParams.api_key_id}`,
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Reset Client API Key
  server.registerTool(
    'smartlead_reset_client_api_key',
    {
      title: 'Reset Client API Key',
      description: 'Reset/regenerate a specific API key.',
      inputSchema: ResetClientApiKeySchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ResetClientApiKeySchema.parse(params);
        const result = await client.clientManagement.resetClientApiKey(validatedParams.api_key_id);
        return formatSuccessResponse(
          `Reset API key ${validatedParams.api_key_id}`,
          result,
          `New API key: ${result.api_key || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
