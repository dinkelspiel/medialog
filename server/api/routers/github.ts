import { createTRPCRouter } from '@/server/api/trpc';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { Octokit } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';

export const githubRouter = createTRPCRouter({
  createIssue: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        route: z.string(),
        label: z.enum(['bug', 'feature', 'enhancement']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: process.env.GITHUB_APP_ID!,
          installationId: process.env.GITHUB_INSTALLATION_ID!,
          privateKey: process.env.GITHUB_PRIVATE_KEY!.split('\\n').join('\n'),
        },
      });

      const response = await octokit.request(
        'POST /repos/{owner}/{repo}/issues',
        {
          owner: process.env.NEXT_PUBLIC_FEEDBACK_REPO_OWNER!,
          repo: process.env.NEXT_PUBLIC_FEEDBACK_REPO!,
          title: input.title,
          body: `user:${ctx.user.id}\nroute:${input.route}\n\n${input.body}`,
          labels: [input.label],
          headers: {
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );

      return {
        issueUrl: response.data.html_url,
      };
    }),
});
