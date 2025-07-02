/**
 * SmartLead MCP Server - Configuration Types
 *
 * Type definitions for configuration, responses, and common interfaces
 * to improve type safety and reduce 'any' usage.
 *
 * @author LeadMagic Team
 * @version 1.6.2
 */

/**
 * Configuration interface for SmartLead API client
 */
export interface SmartLeadConfig {
  /** SmartLead API key (required) */
  apiKey: string;
  /** Custom API base URL (optional, defaults to https://server.smartlead.ai/api/v1) */
  baseUrl?: string;
  /** Request timeout in milliseconds (optional, defaults to 30000) */
  timeout?: number;
  /** Maximum retry attempts (optional, defaults to 3) */
  maxRetries?: number;
  /** Initial retry delay in milliseconds (optional, defaults to 1000) */
  retryDelay?: number;
  /** Rate limit in requests per minute (optional, defaults to 100) */
  rateLimit?: number;
}

/**
 * Standard MCP tool response format
 */
export interface MCPToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

/**
 * Generic API response structure for SmartLead API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

/**
 * Common campaign data structure
 */
export interface CampaignData {
  id: number;
  name: string;
  status?: string;
  client_id?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Common lead data structure
 */
export interface LeadData {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
  phone?: string;
  status?: string;
  campaign_id?: number;
}

/**
 * Format success response function type
 */
export type FormatSuccessResponseFn = (
  message: string,
  data: unknown,
  summary?: string
) => MCPToolResponse;

/**
 * Handle error function type
 */
export type HandleErrorFn = (error: unknown) => MCPToolResponse;
