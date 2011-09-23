build: compile-min test-min

test:
	@echo "running tests on main source..."
	jasmine-node spec

compile-min:
	@echo "building kor.events.min.js with closure..."
	closure --compilation_level ADVANCED_OPTIMIZATIONS --js kor.events.js --js_output_file kor.events.min.js

test-min: compile-min
	@echo "running tests on compiled source..."
	@if [ -d test_sources ]; then \
	  rm -r test_sources/*; \
	else \
	  mkdir test_sources; \
	fi
	@cp -r spec test_sources/
	@cp kor.events.min.js test_sources/kor.events.js
	jasmine-node test_sources/spec

