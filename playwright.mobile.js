import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';


export default defineConfig({
testDir: './src/tests',
reporter: [['list'], ['html', { open: 'never' }]],
use: { trace: 'retain-on-failure' },
projects: [
{
name: 'Mobile Safari',
use: { ...devices['iPhone 14'], baseURL: process.env.BASE_URL }
},
{
name: 'Mobile Chrome',
use: { ...devices['Pixel 7'], baseURL: process.env.BASE_URL }
}
]
});