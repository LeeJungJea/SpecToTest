import type { ParsedApiSpec } from '../types';

// Frontend Generators
import { reactTypescriptGenerator } from './frontend/reactTypescript';
import { nextJsGenerator } from './frontend/nextJs';
import { vue3Generator } from './frontend/vue3';
import { nuxtJsGenerator } from './frontend/nuxtJs';
import { angularGenerator } from './frontend/angular';
import { svelteGenerator } from './frontend/svelte';
import { solidJsGenerator } from './frontend/solidJs';
import { preactGenerator } from './frontend/preact';
import { vanillaTypescriptGenerator } from './frontend/vanillaTypescript';
import { vanillaJavascriptGenerator } from './frontend/vanillaJavascript';

// Backend Generators
import { javaSpringBootGenerator } from './backend/javaSpringBoot';
import { nodeTypescriptGenerator } from './backend/nodeTypescript';
import { pythonFastapiGenerator } from './backend/pythonFastapi';
import { goGinGenerator } from './backend/goGin';
import { csharpDotnetGenerator } from './backend/csharpDotnet';
import { phpLaravelGenerator } from './backend/phpLaravel';
import { rubyOnRailsGenerator } from './backend/rubyOnRails';
import { kotlinKtorGenerator } from './backend/kotlinKtor';
import { rustActixGenerator } from './backend/rustActix';
import { elixirPhoenixGenerator } from './backend/elixirPhoenix';

export const generateTestCode = (spec: ParsedApiSpec, type: 'frontend' | 'backend', langId: string): { code: string, filename: string } => {
  let code = '';
  let filename = 'test.spec.ts';

  if (type === 'frontend') {
    switch (langId) {
      case 'REACT_TYPESCRIPT':
        code = reactTypescriptGenerator.generateTest(spec);
        filename = 'api.test.ts';
        break;
      case 'NEXT_JS':
        code = nextJsGenerator.generateTest(spec);
        filename = 'api.test.ts';
        break;
      case 'VUE_3':
        code = vue3Generator.generateTest(spec);
        filename = 'api.spec.ts';
        break;
      case 'NUXT_JS':
        code = nuxtJsGenerator.generateTest(spec);
        filename = 'api.spec.ts';
        break;
      case 'ANGULAR':
        code = angularGenerator.generateTest(spec);
        filename = 'api.spec.ts';
        break;
      case 'SVELTE':
        code = svelteGenerator.generateTest(spec);
        filename = 'api.test.ts';
        break;
      case 'SOLID_JS':
        code = solidJsGenerator.generateTest(spec);
        filename = 'api.test.ts';
        break;
      case 'PREACT':
        code = preactGenerator.generateTest(spec);
        filename = 'api.test.ts';
        break;
      case 'VANILLA_TYPESCRIPT':
        code = vanillaTypescriptGenerator.generateTest(spec);
        filename = 'api.test.ts';
        break;
      case 'VANILLA_JAVASCRIPT':
        code = vanillaJavascriptGenerator.generateTest(spec);
        filename = 'api.test.js';
        break;
      default:
        code = `// Generator for ${langId} not found`;
        filename = 'test.spec.ts';
    }
  } else {
    switch (langId) {
      case 'JAVA_SPRING_BOOT':
        code = javaSpringBootGenerator.generateTest(spec);
        filename = 'ApiControllerTest.java';
        break;
      case 'NODE_TYPESCRIPT':
        code = nodeTypescriptGenerator.generateTest(spec);
        filename = 'api.test.ts';
        break;
      case 'PYTHON_FASTAPI':
        code = pythonFastapiGenerator.generateTest(spec);
        filename = 'test_api.py';
        break;
      case 'GO_GIN':
        code = goGinGenerator.generateTest(spec);
        filename = 'api_test.go';
        break;
      case 'CSHARP_DOTNET':
        code = csharpDotnetGenerator.generateTest(spec);
        filename = 'ApiTests.cs';
        break;
      case 'PHP_LARAVEL':
        code = phpLaravelGenerator.generateTest(spec);
        filename = 'ApiTest.php';
        break;
      case 'RUBY_ON_RAILS':
        code = rubyOnRailsGenerator.generateTest(spec);
        filename = 'api_spec.rb';
        break;
      case 'KOTLIN_KTOR':
        code = kotlinKtorGenerator.generateTest(spec);
        filename = 'ApiTest.kt';
        break;
      case 'RUST_ACTIX':
        code = rustActixGenerator.generateTest(spec);
        filename = 'api_tests.rs';
        break;
      case 'ELIXIR_PHOENIX':
        code = elixirPhoenixGenerator.generateTest(spec);
        filename = 'api_controller_test.exs';
        break;
      default:
        code = `// Generator for ${langId} not found`;
        filename = 'test_api.ts';
    }
  }

  return { code, filename };
};
