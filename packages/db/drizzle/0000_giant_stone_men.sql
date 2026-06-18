CREATE TABLE "basho" (
	"id" varchar(6) PRIMARY KEY NOT NULL,
	"city" text NOT NULL,
	"winner_id" integer
);
--> statement-breakpoint
CREATE TABLE "rikishi" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"birthday" integer,
	"origin" text
);
--> statement-breakpoint
CREATE TABLE "rikishi_basho" (
	"rikishi_id" integer NOT NULL,
	"basho_id" varchar(6) NOT NULL,
	"rank" text,
	"division" text,
	"weight" integer,
	CONSTRAINT "rikishi_basho_rikishi_id_basho_id_pk" PRIMARY KEY("rikishi_id","basho_id")
);
--> statement-breakpoint
CREATE TABLE "torikumi" (
	"id" text PRIMARY KEY NOT NULL,
	"kimarite" text,
	"east_rikishi" integer NOT NULL,
	"west_rikishi" integer NOT NULL,
	"division" text NOT NULL,
	"day" integer NOT NULL,
	"match_number" integer NOT NULL,
	"winner_id" integer,
	"basho_id" varchar(6) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "basho" ADD CONSTRAINT "basho_winner_id_rikishi_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."rikishi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rikishi_basho" ADD CONSTRAINT "rikishi_basho_rikishi_id_rikishi_id_fk" FOREIGN KEY ("rikishi_id") REFERENCES "public"."rikishi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rikishi_basho" ADD CONSTRAINT "rikishi_basho_basho_id_basho_id_fk" FOREIGN KEY ("basho_id") REFERENCES "public"."basho"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "torikumi" ADD CONSTRAINT "torikumi_east_rikishi_rikishi_id_fk" FOREIGN KEY ("east_rikishi") REFERENCES "public"."rikishi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "torikumi" ADD CONSTRAINT "torikumi_west_rikishi_rikishi_id_fk" FOREIGN KEY ("west_rikishi") REFERENCES "public"."rikishi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "torikumi" ADD CONSTRAINT "torikumi_basho_id_basho_id_fk" FOREIGN KEY ("basho_id") REFERENCES "public"."basho"("id") ON DELETE no action ON UPDATE no action;