import { sql, isDatabaseConfigured } from "./db";

export type SyndicationChannel = "webflow" | "hubspot" | "wordpress" | "linkedin";

export interface SyndicationPayload {
  documentId: string;
  title: string;
  content: string;
  tags?: string[];
  author?: string;
  channels: SyndicationChannel[];
  utmSource?: string;
  utmCampaign?: string;
}

export interface ChannelPublishResult {
  channel: SyndicationChannel;
  success: boolean;
  externalUrl?: string;
  externalId?: string;
  simulated?: boolean;
  error?: string;
  timestamp: string;
}

/**
 * Enterprise CMS & Social Syndication Engine
 * Handles programmatic dispatch to Webflow CMS, HubSpot Blog, WordPress REST, and LinkedIn.
 */
export const syndicationEngine = {
  async publishToWebflow(payload: SyndicationPayload): Promise<ChannelPublishResult> {
    const token = process.env.WEBFLOW_API_TOKEN;
    const now = new Date().toISOString();

    if (!token) {
      return {
        channel: "webflow",
        success: true,
        simulated: true,
        externalUrl: `https://staging-webflow.nexus-content.io/posts/${payload.documentId}`,
        externalId: `wf_item_${payload.documentId}`,
        timestamp: now
      };
    }

    try {
      const res = await fetch("https://api.webflow.com/v2/collections/default/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fieldData: {
            name: payload.title,
            slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            "post-body": payload.content
          }
        })
      });

      if (!res.ok) throw new Error(`Webflow API error: ${res.statusText}`);
      const data = await res.json();
      return {
        channel: "webflow",
        success: true,
        externalId: data.id,
        externalUrl: `https://webflow.com/designer/items/${data.id}`,
        timestamp: now
      };
    } catch (err: unknown) {
      return {
        channel: "webflow",
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: now
      };
    }
  },

  async publishToHubspot(payload: SyndicationPayload): Promise<ChannelPublishResult> {
    const token = process.env.HUBSPOT_ACCESS_TOKEN;
    const now = new Date().toISOString();

    if (!token) {
      return {
        channel: "hubspot",
        success: true,
        simulated: true,
        externalUrl: `https://app.hubspot.com/blog/staging/post/${payload.documentId}`,
        externalId: `hs_post_${payload.documentId}`,
        timestamp: now
      };
    }

    try {
      const res = await fetch("https://api.hubapi.com/cms/v3/blogs/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: payload.title,
          postBody: payload.content,
          state: "DRAFT"
        })
      });

      if (!res.ok) throw new Error(`HubSpot API error: ${res.statusText}`);
      const data = await res.json();
      return {
        channel: "hubspot",
        success: true,
        externalId: data.id,
        externalUrl: data.url || `https://app.hubspot.com/blog/posts/${data.id}`,
        timestamp: now
      };
    } catch (err: unknown) {
      return {
        channel: "hubspot",
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: now
      };
    }
  },

  async publishToWordpress(payload: SyndicationPayload): Promise<ChannelPublishResult> {
    const wpUrl = process.env.WORDPRESS_REST_URL;
    const wpPassword = process.env.WORDPRESS_APP_PASSWORD;
    const now = new Date().toISOString();

    if (!wpUrl || !wpPassword) {
      return {
        channel: "wordpress",
        success: true,
        simulated: true,
        externalUrl: `https://wp-staging.nexus-os.ai/?p=${payload.documentId}`,
        externalId: `wp_${payload.documentId}`,
        timestamp: now
      };
    }

    try {
      const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(wpPassword).toString("base64")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: payload.title,
          content: payload.content,
          status: "publish"
        })
      });

      if (!res.ok) throw new Error(`WordPress API error: ${res.statusText}`);
      const data = await res.json();
      return {
        channel: "wordpress",
        success: true,
        externalId: String(data.id),
        externalUrl: data.link,
        timestamp: now
      };
    } catch (err: unknown) {
      return {
        channel: "wordpress",
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: now
      };
    }
  },

  async publishToLinkedin(payload: SyndicationPayload): Promise<ChannelPublishResult> {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    const now = new Date().toISOString();

    if (!token) {
      return {
        channel: "linkedin",
        success: true,
        simulated: true,
        externalUrl: `https://www.linkedin.com/feed/update/urn:li:share:sim_${payload.documentId}`,
        externalId: `urn:li:share:sim_${payload.documentId}`,
        timestamp: now
      };
    }

    try {
      const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0"
        },
        body: JSON.stringify({
          author: "urn:li:person:me",
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: `${payload.title}\n\n${payload.content.slice(0, 500)}...\n\nRead more via governed workspace.`
              },
              shareMediaCategory: "NONE"
            }
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
          }
        })
      });

      if (!res.ok) throw new Error(`LinkedIn API error: ${res.statusText}`);
      const data = await res.json();
      return {
        channel: "linkedin",
        success: true,
        externalId: data.id,
        externalUrl: `https://www.linkedin.com/feed/update/${data.id}`,
        timestamp: now
      };
    } catch (err: unknown) {
      return {
        channel: "linkedin",
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: now
      };
    }
  },

  async dispatchAll(payload: SyndicationPayload): Promise<ChannelPublishResult[]> {
    const results: ChannelPublishResult[] = [];

    for (const ch of payload.channels) {
      if (ch === "webflow") results.push(await this.publishToWebflow(payload));
      if (ch === "hubspot") results.push(await this.publishToHubspot(payload));
      if (ch === "wordpress") results.push(await this.publishToWordpress(payload));
      if (ch === "linkedin") results.push(await this.publishToLinkedin(payload));
    }

    // Save syndication audit to Neon database
    if (sql && isDatabaseConfigured()) {
      try {
        for (const res of results) {
          await sql`
            INSERT INTO syndication_configs (id, workspace_id, channel, status, last_sync_at)
            VALUES (
              ${`sync_${res.channel}_${Date.now()}`},
              ${"1"},
              ${res.channel},
              ${res.success ? "connected" : "error"},
              NOW()
            )
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      } catch (err) {
        console.warn("Neon syndication audit insert error:", err);
      }
    }

    return results;
  }
};
