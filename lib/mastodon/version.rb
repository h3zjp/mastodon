# frozen_string_literal: true

module Mastodon
  module Version
    module_function

    def h3zjp
      'h3zjp/'
    end
    
    def major
      2
    end

    def minor
      4
    end

    def patch
      5
    end

    def pre
      nil
    end

    def flags
      nil
    end

    def to_a
      [major, minor, patch, pre].compact
    end

    def to_s
      [h3zjp, to_a.join('.'), flags].join
    end

    def repository
      'h3zjp/mastodon'
    end

    def source_base_url
      'https://github.com/#{repository}'
    end

    # specify git tag or commit hash here
    def source_tag
      nil
    end

    def source_url
      if source_tag
        "#{source_base_url}/tree/#{source_tag}"
      else
        source_base_url
      end
    end

    def user_agent
      @user_agent ||= "#{HTTP::Request::USER_AGENT} (Mastodon/#{Version}; +http#{Rails.configuration.x.use_https ? 's' : ''}://#{Rails.configuration.x.web_domain}/)"
    end
  end
end
