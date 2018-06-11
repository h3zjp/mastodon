threads_count = ENV.fetch('MAX_THREADS') { 4 }.to_i
threads threads_count, threads_count

if ENV['SOCKET'] then
  bind 'unix://' + ENV['SOCKET']
else
  bind 'tcp://192.168.20.1:' + ENV.fetch('PORT') { 3000 }
end

environment ENV.fetch('RAILS_ENV') { 'development' }
workers     ENV.fetch('WEB_CONCURRENCY') { 2 }

preload_app!

on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end

plugin :tmp_restart
