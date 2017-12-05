﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace LITHStudios_Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockout.validation.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/sammy-{version}.js",
                "~/Scripts/app/common.js",
                "~/Scripts/app/app.datamodel.js",
                "~/Scripts/app/app.viewmodel.js",
                "~/Scripts/app/home.viewmodel.js",
                "~/Scripts/app/_run.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                 "~/Content/Site.css",
                 "~/Content/bootstrap.css"));

            bundles.Add(new ScriptBundle("~/bundles/webgl").Include(
                "~/Scripts/webgl/THREE/three.js",
                "~/Scripts/webgl/THREE/EffectComposer.js",
                "~/Scripts/webgl/THREE/RenderPass.js",
                "~/Scripts/webgl/THREE/CopyShader.js",
                "~/Scripts/webgl/THREE/ShaderPass.js",
                "~/Scripts/webgl/THREE/MaskPass.js",
                "~/Scripts/webgl/Helpers/MathUtils.js", 
                "~/Scripts/webgl/Shaders/MetaBalls.js",
                "~/Scripts/webgl/main.js"
                ));
        }
    }
}
