
class entity_cpu_t extends entity_t {
	_init() {
		this._animation_time = 0;
	}

	_render() {
		this._animation_time += time_elapsed;

		push_block(this.x, this.z, 4, 17);
		var intensity = this.h == 5 
			? 0.02 + _math.sin(this._animation_time*10+_math.random()*2) * 0.01
			: 0.01;
		push_light(this.x + 4, 4, this.z + 12, 0.2, 0.4, 1.0, intensity);
	}

	_check(other) {

		if (this.h == 5 && other instanceof(entity_player_t)) {
			this.h = 10;
			cpus_rebooted++;

			var reboot_message = 
				'\n\n\nსერვერი ირთვება..._' +
				'სერვერის ჩართვა წარმატებით დასრულდა\n';

			if (cpus_total-cpus_rebooted > 0) {
				terminal_show_notice(
					reboot_message + 
					(cpus_total-cpus_rebooted)+' სისტემა კიდევ OFFLINE არის'
				);
			}
			else {
				if (current_level != 3) {
					terminal_show_notice(
						reboot_message +
						'ყველა სისტემა Online არის.\n' +
						'ტელეპორტაციისთვის კოორდინატებს ვეძებ...___' +
						'კოორდინატები ნაპოვნია\n' +
						'ახლა გადატელეპორტდები...',
						next_level
					);
				}
				else {
					terminal_show_notice(
						reboot_message +
						'ყველა სისტემა Online არის.',
						next_level
					);
				}
			}
			audio_play(audio_sfx_beep);
		}
	}
}
