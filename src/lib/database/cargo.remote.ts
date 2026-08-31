import { getRequestEvent, query } from "$app/server"
import { sql } from 'bun';
import * as z from 'zod';
import { error } from "@sveltejs/kit";
